const { loadModule, getResourceUrl } = mod.getContext(import.meta);

const { InventionOverviewUIComponent } = await loadModule('src/components/invention-overview.mjs');
const { InventionOverviewNavItemUIComponent } = await loadModule('src/components/invention-overview-nav-item.mjs');

class InventionOverviewNavItem {
    constructor(data) {
        this.data = data;
        this.component = new InventionOverviewNavItemUIComponent();

        if(data.classList !== undefined)
            this.component.clickable.classList.add(...data.classList)

        this.component.clickable.onclick = () => this.clicked();
    }

    clicked() {
        if(this.data.page !== undefined) {
            let page = this.page;
            if(page !== undefined) {
                if(this.data.pageFn !== undefined && page[this.data.pageFn] !== undefined) {
                    page[this.data.pageFn]();
                } else {
                    page.go();
                }
            }
        }
    }

    get page() {
        return game.invention.pages.byId.get(this.data.page);
    }
    
    get active() {
        if(this.data.page !== undefined)
            if(this.page !== undefined && this.page.active)
                return true;
        return false;
    }

    get name() {
        return this.data.name !== undefined ? this.data.name : this.page.name;
    }

    get media() {
        return this.data.media !== undefined ? getResourceUrl(this.data.media) : this.page !== undefined && this.page.media !== undefined ? this.page.media : '';
    }

    render() {
        this.component.name.classList.toggle('text-success', this.active);
        this.component.name.textContent = this.name;
        this.component.icon.src = this.media;
        this.component.icon.classList.toggle('d-none', this.media !== undefined)
    }
}

class OverviewRenderQueue {
    constructor() {
        this.nav = false;
    }
}

export class InventionOverview {
    constructor(manager, game) {
        this.renderQueue = new OverviewRenderQueue();
        this.component = new InventionOverviewUIComponent();

        this.menu = new Set();
    }

    onLoad() {
        this.renderQueue.nav = true;
    }

    registerData(data) {
        if(data.nav !== undefined) {
            data.nav.forEach(navData => {
                let nav = new InventionOverviewNavItem(navData);
                nav.component.mount(this.component.menu);
                this.menu.add(nav);
                nav.render();
            });
        }
    }

    postDataRegistration() {

    }

    render() {
        this.renderNav();
    }

    renderNav() {
        if(!this.renderQueue.nav)
            return;

        this.menu.forEach(nav => nav.render());

        this.renderQueue.nav = false;
    }
}