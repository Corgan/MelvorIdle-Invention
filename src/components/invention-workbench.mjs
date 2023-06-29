const { loadModule } = mod.getContext(import.meta);

const { InventionPageUIComponent } = await loadModule('src/components/invention-page.mjs');

export class InventionWorkbenchUIComponent extends InventionPageUIComponent {
    constructor() {
        super('invention-workbench-component');
    }
}