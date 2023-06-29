const { loadModule } = mod.getContext(import.meta);

const { UIComponent } = await loadModule('src/components/ui-component.mjs');

export class InventionOverviewNavItemUIComponent extends UIComponent {
    constructor() {
        super('invention-overview-nav-item-component');

        this.clickable = getElementFromFragment(this.$fragment, 'clickable', 'a');
        this.name = getElementFromFragment(this.$fragment, 'name', 'span');
        this.icon = getElementFromFragment(this.$fragment, 'icon', 'img');
    }
}