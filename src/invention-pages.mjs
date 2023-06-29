const { loadModule } = mod.getContext(import.meta);

const { InventionPage } = await loadModule('src/invention-page.mjs');

export class InventionPages {
    constructor(manager, game) {
        this.manager = manager;
        this.game = game;
        this.pages = new Set();
        this.byId = new Map();
        this.current = false;
    }

    onPageChange() {
        this.pages.forEach(p => p.onShow());
    }

    onLoad() {
        this.pages.forEach(p => p.onLoad());
    }

    onLevelUp() {
        this.pages.forEach(p => p.onLevelUp());
    }

    queueBankQuantityRender(item) {
        if(this.current)
            this.current.queueBankQuantityRender(item);
    }

    activeTick() {
        this.pages.forEach(p => p.activeTick());
    }

    initMenus() {
        this.pages.forEach(p => p.initMenus());
    }

    postDataRegistration() {
        this.pages.forEach(p => p.postDataRegistration());
    }

    go(page) {
        if(page instanceof InventionPage && page !== this.current) {
            this.pages.forEach(p => {
                if(p !== page) {
                    p.component.hide();
                    p.onHide();
                }
            });

            this.current = page;

            page.component.show();
            page.onShow();
        }

        this.manager.overview.renderQueue.nav = true;
    }

    register(id, page) {
        if(page instanceof InventionPage) {
            this.pages.add(page);
            this.byId.set(id, page);
            page.component.mount(this.manager.component.pages);
        }
    }

    render() {
        this.pages.forEach(p => p.render());
    }

    encode(writer) {
        writer.writeComplexMap(this.byId, (key, value, writer) => {
            writer.writeString(key);
            value.encode(writer);
        });
        return writer;
    }

    decode(reader, version) {
        reader.getComplexMap((reader) => {
            let key = reader.getString();
            let page = this.byId.get(key);
            page.decode(reader, version);
        });
    }
}