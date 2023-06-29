const { loadModule } = mod.getContext(import.meta);

const { UIComponent } = await loadModule('src/components/ui-component.mjs');
const { OverviewUIComponent }= await loadModule('src/components/invention-overview.mjs');

export class InventionPageUIComponent extends UIComponent {
    constructor() {
        super('invention-page-component');

        this.overview = getElementFromFragment(this.$fragment, 'overview', 'div');

        this.pages = getElementFromFragment(this.$fragment, 'pages', 'div');
    }
}