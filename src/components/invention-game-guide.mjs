const { loadModule } = mod.getContext(import.meta);

const { UIComponent } = await loadModule('src/components/ui-component.mjs');


export class InventionGameGuideComponent extends UIComponent {
    constructor(manager, game) {
        super('invention-game-guide');

        this.manager = manager;
        this.game = game;
    }
}