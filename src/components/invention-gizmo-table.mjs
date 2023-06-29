const { loadModule } = mod.getContext(import.meta);

const { InventionPageUIComponent } = await loadModule('src/components/invention-page.mjs');

export class InventionGizmoTableUIComponent extends InventionPageUIComponent {
    constructor() {
        super('invention-gizmo-table-component');
    }
}