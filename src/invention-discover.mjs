const { loadModule } = mod.getContext(import.meta);

const { InventionPage } = await loadModule('src/invention-page.mjs');

const { InventionDiscoverUIComponent } = await loadModule('src/components/invention-discover.mjs');

class InventionDiscoverRenderQueue {
    constructor(){
    }
    updateAll() {
    }
}

export class InventionDiscover extends InventionPage {
    constructor(manager, game) {
        super(manager, game);

        this.component = new InventionDiscoverUIComponent();
    }

    onLoad() {
        super.onLoad();
    }

    onLevelUp() {
    }

    onShow() {
    }

    onHide() {
        super.onHide();
    }

    postDataRegistration() {

    }

    initMenus() {

    }

    render() {
        super.render();
    }

    encode(writer) {
        return writer;
    }

    decode(reader, version) {

    }
}