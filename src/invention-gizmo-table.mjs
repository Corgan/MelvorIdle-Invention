const { loadModule } = mod.getContext(import.meta);

const { InventionPage } = await loadModule('src/invention-page.mjs');

const { InventionGizmoTableUIComponent } = await loadModule('src/components/invention-gizmo-table.mjs');

class InventionGizmoTableRenderQueue {
    constructor(){
        this.details = false;
    }
    updateAll() {
        this.details = true;
    }
}

export class InventionGizmoTable extends InventionPage {
    constructor(manager, game) {
        super(manager, game);

        this.component = new InventionGizmoTableUIComponent();
        this.renderQueue = new InventionGizmoTableRenderQueue();
    }

    onLoad() {
        super.onLoad();
    }

    onShow() {
        
    }

    onHide() {
        super.onHide();
    }

    postDataRegistration() {

    }

    render() {

    }

    encode(writer) {
        return writer;
    }

    decode(reader, version) {

    }
}