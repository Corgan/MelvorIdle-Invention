const { loadModule } = mod.getContext(import.meta);

const { InventionPageUIComponent } = await loadModule('src/components/invention-page.mjs');

export class InventionAugmentationUIComponent extends InventionPageUIComponent {
    constructor() {
        super('invention-augmentation-component');
    }
}