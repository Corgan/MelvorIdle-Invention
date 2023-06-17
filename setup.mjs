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

    onInterfaceAvailable(async () => {
        const skill = game.skills.registeredObjects.get("invention:Invention");

        console.log("Appending Invention Page");
        skill.component.mount(document.getElementById('main-container')); // Add skill container
    });
}