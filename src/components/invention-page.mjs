const { loadModule } = mod.getContext(import.meta);

const { UIComponent } = await loadModule('src/components/ui-component.mjs');

export class InventionPageUIComponent extends UIComponent {
    constructor(template) {
        super(template);

        this.page = getElementFromFragment(this.$fragment, 'page', 'div');
    }
}