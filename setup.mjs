export async function setup({ gameData, patch, loadTemplates, loadModule, onInterfaceAvailable, onCharacterLoaded }) {
    console.log("Loading Invention Templates");
    await loadTemplates("templates.html"); // Add templates
  
    console.log("Loading Invention Module");
    const { Invention } = await loadModule('src/invention.mjs'); // Load skill

    console.log("Registering Invention Skill");
    game.invention = game.registerSkill(game.registeredNamespaces.getNamespace('invention'), Invention); // Register skill

    patch(NamespaceRegistry, 'getObjectByID').replace(function(o, id) {
        let obj = o(id);
        if(obj === undefined && id !== undefined && id.startsWith("invention")) {
            return game.invention.handleMissingObject(id);
        }
        return obj;
    });

    patch(Bank, 'processItemSale').replace(function(o, item, quantity) {
        o(item, quantity);
        if(item.namespace === 'invention') {
            if(game.invention.isAugmentedItem(item)) {
                game.invention.removeAugmentedItem(item);
            }
            if(game.invention.isGizmo(item)) {
                game.invention.removeGizmo(item);
            }
        }
    });

    patch(Costs, 'consumeCosts').replace(function(o) {
        o();
        this._items.forEach((quantity, item) => {
            if(quantity > 0) {
                if(item.namespace === 'invention') {
                    if(game.invention.isAugmentedItem(item)) {
                        game.invention.removeAugmentedItem(item);
                    }
                    if(game.invention.isGizmo(item)) {
                        game.invention.removeGizmo(item);
                    }
                }
            }
        });
    });

    patch(Telemetry, 'updatePlayerDeathEventItemLost').replace(function(o, itemLost, count=0) {
        o(itemLost, count);
        if(itemLost.namespace === 'invention') {
            if(game.invention.isAugmentedItem(itemLost)) {
                game.invention.removeAugmentedItem(itemLost);
            }
        }
    });

    patch(Player, 'rewardForDamage').replace(function(o, damage) {
        o(damage);
        game.invention.rewardForDamage(damage);
    });

    patch(Player, 'updateForEquipmentChange').before(function() {
        game.invention.onEquipmentChange();
    });

    patch(Player, 'updateForEquipSetChange').before(function() {
        game.invention.onEquipSetChange();
    });

    patch(Equipment, 'removeQuantityFromSlot').before(function(slot, quantity) {
        console.log(slot, quantity);
    });

    patch(BankSelectedItemMenu, 'setItem').replace(function(o, bankItem, bank) {
        o(bankItem, bank);
        if(this.insertGizmosButton === undefined) {
            this.insertGizmosButton = createElement('h5', {
                classList: ['font-w400', 'font-size-sm', 'text-left', 'combat-action', 'm-1', 'mb-2', 'pointer-enabled'],
                children: [createElement('span', { text: 'Manage Gizmos'})]
            });
            this.viewStatsButton.before(this.insertGizmosButton);
        }

        const item = bankItem.item;
        if (game.invention.isAugmentedItem(item)) {
            showElement(this.insertGizmosButton);
            this.insertGizmosButton.onclick = ()=>game.invention.showGizmoModal(item);
        } else {
            hideElement(this.insertGizmosButton);
        }
    });

    console.log("Registering Invention Data");
    await gameData.addPackage('data.json'); // Add skill data (page + sidebar, skillData)

    console.log('Registered Invention Data.');

    onCharacterLoaded(async() => {
        game.invention.onCharacterLoaded();
    });

    onInterfaceAvailable(async () => {
        console.log("Appending Invention Page");
        game.invention.component.mount(document.getElementById('main-container')); // Add skill container
        game.invention.gizmoModal.mount(document.getElementById('page-container')); // Add Gizmo Modal
        game.invention.gameGuide.mount(document.querySelector('#modal-game-guide .block-content.block-content-full')); // Add Game Guide

        game.invention.pages.initMenus();
        game.invention.onInterfaceAvailable();
    });
}