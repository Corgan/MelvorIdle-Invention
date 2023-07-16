const { loadModule } = mod.getContext(import.meta);

const { InventionPageUIComponent } = await loadModule('src/components/invention-page.mjs');

export class InventionDiscoverUIComponent extends InventionPageUIComponent {
    constructor() {
        super('invention-discover-component');
    }
}