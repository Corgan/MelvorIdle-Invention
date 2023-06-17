const { loadModule } = mod.getContext(import.meta);

const { UIComponent } = await loadModule('src/components/ui-component.mjs');

export class InventionPageUIComponent extends UIComponent {
    constructor(manager, game) {
        super(manager, game, 'invention-page-component');
    }
}