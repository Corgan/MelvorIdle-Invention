const { loadModule } = mod.getContext(import.meta);

const { InventionPageUIComponent } = await loadModule('src/components/invention-page.mjs');

export class InventionDisassembleUIComponent extends InventionPageUIComponent {
    constructor() {
        super('invention-disassemble-component');
    }
}