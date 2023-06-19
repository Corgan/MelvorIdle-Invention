export async function setup({ gameData, patch, loadTemplates, loadModule, onInterfaceAvailable, onInterfaceReady }) {
    console.log("Loading Invention Templates");
    await loadTemplates("templates.html"); // Add templates
  
    console.log("Loading Invention Module");
    const { Invention } = await loadModule('src/invention.mjs'); // Load skill

    console.log("Registering Invention Skill");
    game.registerSkill(game.registeredNamespaces.getNamespace('invention'), Invention); // Register skill

    console.log("Registering Invention Data");
    await gameData.addPackage('data.json'); // Add skill data (page + sidebar, skillData)

    console.log('Registered Invention Data.');

    patch(Bank, 'processItemSale').replace(function(o, item, quantity) {
        o(item, quantity);
        if(item.namespace === 'invention') {
            let invention = game.skills.registeredObjects.get("invention:Invention");
            if(invention.isAugmentedItem(item)) {
                invention.removeAugmentedItem(item);
            }
        }
    });

    patch(Costs, 'consumeCosts').replace(function(o) {
        o();
        this._items.forEach((quantity, item) => {
            if(quantity > 0) {
                if(item.namespace === 'invention') {
                    let invention = game.skills.registeredObjects.get("invention:Invention");
                    if(invention.isAugmentedItem(item)) {
                        invention.removeAugmentedItem(item);
                    }
                }
            }
        });
    });

    patch(Telemetry, 'updatePlayerDeathEventItemLost').replace(function(o, itemLost, count=0) {
        o(itemLost, count);
        if(itemLost.namespace === 'invention') {
            let invention = game.skills.registeredObjects.get("invention:Invention");
            if(invention.isAugmentedItem(itemLost)) {
                invention.removeAugmentedItem(itemLost);
            }
        }
    });

    onInterfaceAvailable(async () => {
        const skill = game.skills.registeredObjects.get("invention:Invention");

        game.invention = skill;

        console.log("Appending Invention Page");
        skill.component.mount(document.getElementById('main-container')); // Add skill container
    });
}