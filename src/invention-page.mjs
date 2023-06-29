const { loadModule } = mod.getContext(import.meta);

export class InventionPage {
    constructor(manager, game) {
        this.manager = manager;
        this.game = game;
    }

    get active() {
        if(this.manager.pages.current === this)
            return true;
    }

    go() {
        this.manager.pages.go(this);
    }

    onShow() { }

    onHide() { }

    onLoad() { }

    onLevelUp() { }

    activeTick() { }

    queueBankQuantityRender() { }

    initMenus() { }

    postDataRegistration() {

    }

    render() {

    }

    encode(writer) {
    }

    decode(reader, version) {
    }
}