export async function setup({ gameData, patch, loadTemplates, loadModule, onInterfaceAvailable, onCharacterLoaded }) {
    console.log("Loading Invention Templates");
    await loadTemplates("templates.html"); // Add templates
  
    console.log("Loading Invention Module");
    const { Invention } = await loadModule('src/invention.mjs'); // Load skill

    console.log("Registering Invention Skill");
    game.invention = game.registerSkill(game.registeredNamespaces.getNamespace('invention'), Invention); // Register skill

    patch(NamespaceRegistry, 'getObjectByID').replace(function(o, id) {
        let obj = o(id);
        try {
            if(obj === undefined && id !== undefined && id.startsWith("invention")) {
                return game.invention.handleMissingObject(id);
            }
        } catch(e) { console.log("Invention Error: ", e) }

        return obj;
    });

    patch(Player, 'rewardForDamage').replace(function(o, damage) {
        o(damage);
        try { game.invention.rewardForDamage(damage); } catch(e) { console.log("Invention Error: ", e) }
    });

    patch(Equipment, 'removeQuantityFromSlot').before(function(slot, quantity) {
        //console.log(slot, quantity);
    });

    patch(BankSelectedItemMenu, 'setItem').replace(function(o, bankItem, bank) {
        o(bankItem, bank);
        try {
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
        } catch(e) { console.log("Invention Error: ", e) }
    });

    //patch(Player, 'computeAllStats').after(function() {
    //    game.invention.computeAllStats(this);
    //});

    patch(Player, 'addEquippedItemModifiers').after(function() {
        try { game.invention.addEquippedItemModifiers(this); } catch(e) { console.log("Invention Error: ", e) }
    });
    patch(Player, 'computeTargetModifiers').after(function() {
        try { game.invention.computeTargetModifiers(this); } catch(e) { console.log("Invention Error: ", e) }
    });
    patch(Player, 'computeEquipmentStats').after(function() {
        try { game.invention.computeEquipmentStats(this); } catch(e) { console.log("Invention Error: ", e) }
    });
    patch(Player, 'computeItemEffectList').after(function() {
        try { game.invention.computeItemEffectList(this); } catch(e) { console.log("Invention Error: ", e) }
    });
    patch(Player, 'computeRuneProvision').after(function() {
        try { game.invention.computeRuneProvision(this); } catch(e) { console.log("Invention Error: ", e) }
    });
    patch(Player, 'onHit').before(function() {
        try { game.invention.playerOnHit(this); } catch(e) { console.log("Invention Error: ", e) }
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