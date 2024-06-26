const { loadModule } = mod.getContext(import.meta);

const { UIComponent } = await loadModule('src/components/ui-component.mjs');

class ItemGizmoIcon extends ItemQtyIcon {
    constructor(parent) {
        super(parent);
    }

    localize() {
        this.setTooltip(this.getTooltipContent());
    }
    setCallback(callback) {
        this.container.onclick = callback;
    }
    hasDescription() {
        if (this.item === undefined)
            return false;
        return this.item.hasDescription;
    }
    getDescription() {
        if (this.item === undefined)
            return '';
        return this.item.description;
    }
    getTooltipContent() {
        let tt = `<div class="text-center">${this.getName()}</div>`;
        if(this.hasDescription())
            tt += `<div class="text-center">${this.getDescription()}</div>`
        return tt;
    }
}

class InventionGizmoSelectorTab {
    constructor(modal, container) {
        this.modal = modal;
        this.container = container;
        this.icons = [];
    }
    show() {
        showElement(this.container);
    }
    hide() {
        hideElement(this.container);
    }
    invisible() {
        this.container.classList.add('invisible');
    }
    visible() {
        this.container.classList.remove('invisible');
    }
    localize() {
        this.icons.forEach((icon)=>icon.localize());
    }
    destroyIcons() {
        this.icons.forEach((icon)=>{
            icon.destroy();
        });
        this.icons = [];
    }
    updateItem(item) {
        let icon = this.icons.find(i => i.item === item);
        let qty = game.bank.getQty(item);
        if(qty > 0) {
            if(icon === undefined) {
                if(!this.modal.manager.isGizmo(item))
                    return;
                if(!this.modal.item.canEquipGizmo(item))
                    return;
                let icon = new ItemGizmoIcon(this.container);
                icon.setItem(item, game.bank.getQty(item));
                icon.setCallback(()=>this.modal.selectItemOnClick(item));
                icon.localize();
                this.icons.push(icon);
            }
        } else if (qty === 0) {
            if(icon !== undefined) {
                icon.destroy();
                this.icons.splice(this.icons.indexOf(icon), 1);
            }
        }
    }
    updateItems() {
        this.destroyIcons();
        let items = game.bank.filterItems(bankItem => {
            if(this.modal.manager.isGizmo(bankItem.item)) {
                if(this.modal.item.canEquipGizmo(bankItem.item))
                    return true;
            }
            return false;
        });
        items.forEach((item)=>{
            this.updateItem(item);
        });
        this.localize();
    }
}
export class InventionGizmoUIComponent extends UIComponent {
    constructor(manager, game, modal) {
        super('invention-gizmo-modal-gizmo-component');
        this.manager = manager;
        this.game = game;
        this.modal = modal;
        this.container = getElementFromFragment(this.$fragment, 'container', 'div');
        this.icon = getElementFromFragment(this.$fragment, 'gizmo-icon', 'img');
        this.name = getElementFromFragment(this.$fragment, 'gizmo-name', 'small');
        this.description = getElementFromFragment(this.$fragment, 'gizmo-description', 'small');
        this.add = getElementFromFragment(this.$fragment, 'add', 'button');
        this.remove = getElementFromFragment(this.$fragment, 'remove', 'button');
    }

    show() {
        this.container.classList.remove('d-none');
    }

    hide() {
        this.container.classList.add('d-none');
    }

    setGizmo(gizmo) {
        this.container.classList.remove('bg-easy-task');
        if(gizmo !== undefined) {
            this.icon.src = gizmo.media;
            this.name.textContent = gizmo.name;
            this.description.innerHTML = gizmo.description;
            this.add.parentElement.classList.add('d-none');
            this.add.onclick = () => {};
            this.remove.parentElement.classList.remove('d-none');
            this.remove.onclick = () => {
                this.modal.item.removeGizmo(gizmo);
                this.game.bank.addItem(gizmo, 1, false, false, true, false);
                this.modal.gizmoSelector.updateItem(gizmo);
                this.modal.setItem(this.modal.item);
                bankSideBarMenu.selectedMenu.setItem(this.game.bank.selectedBankItem, this.game.bank);
            };
        } else {
            this.icon.src = `${CDNDIR()}assets/media/bank/passive_slot.png`;
            this.name.textContent = "Empty";
            this.description.innerHTML = "";
            this.add.onclick = () => this.modal.setGizmoSlot(this);
            this.add.parentElement.classList.remove('d-none');
            this.remove.onclick = () => {};
            this.remove.parentElement.classList.add('d-none');
        }
    }
}

export class InventionGizmoModalUIComponent extends UIComponent {
    constructor(manager, game) {
        super('invention-gizmo-modal-component');

        this.manager = manager;
        this.game = game;

        this.content = getElementFromFragment(this.$fragment, 'content', 'div');

        this.gizmo1Container = getElementFromFragment(this.$fragment, 'gizmo-slot-1', 'div');
        this.gizmo2Container = getElementFromFragment(this.$fragment, 'gizmo-slot-2', 'div');

        this.gizmo1 = new InventionGizmoUIComponent(this.manager, this.game, this);
        this.gizmo1.mount(this.gizmo1Container);
        this.gizmo2 = new InventionGizmoUIComponent(this.manager, this.game, this);
        this.gizmo2.mount(this.gizmo2Container);

        this.gizmoSelectorContainer = getElementFromFragment(this.$fragment, 'gizmo-selector-container', 'div');

        this.gizmoSelector = new InventionGizmoSelectorTab(this, this.gizmoSelectorContainer);
        this.gizmoSelector.hide();
    }

    setItem(item) {
        this.gizmoSelector.destroyIcons();
        this.gizmoSelector.hide();
        this.item = item;
        let gizmos = [...item.gizmos];
        this.gizmo1.setGizmo(gizmos[0]);
        if(this.item.slots >= 2) {
            this.gizmo2.show();
            this.gizmo2.setGizmo(gizmos[1]);
        } else {
            this.gizmo2.hide();
        }
    }

    setGizmoSlot(slot) {
        if(this.insertGizmoSlot !== slot) {
            this.insertGizmoSlot = slot;
            this.insertGizmoSlot.container.classList.add('bg-easy-task');
            this.gizmoSelector.updateItems();
            this.gizmoSelector.show();
        } else {
            this.insertGizmoSlot.container.classList.remove('bg-easy-task');
            this.insertGizmoSlot = undefined;
            this.gizmoSelector.destroyIcons();
            this.gizmoSelector.hide();
        }
    }

    selectItemOnClick(gizmo) {
        if(this.insertGizmoSlot !== undefined) {
            this.insertGizmoSlot.container.classList.remove('bg-easy-task');
            this.insertGizmoSlot = undefined;
            if(this.item.attachGizmo(gizmo)) {
                this.game.bank.removeItemQuantity(gizmo, game.bank.getQty(gizmo));
                this.gizmoSelector.updateItem(gizmo);
                this.gizmoSelector.hide();
                this.setItem(this.item);
                bankSideBarMenu.selectedMenu.setItem(this.game.bank.selectedBankItem, this.game.bank);
            }
        }
    }
}