const { loadModule } = mod.getContext(import.meta);

const { UIComponent } = await loadModule('src/components/ui-component.mjs');

export class InventionOverviewUIComponent extends UIComponent {
    constructor() {
        super('invention-overview-component');

        this.menu = getElementFromFragment(this.$fragment, 'menu', 'ul');
    }
}