const { loadModule } = mod.getContext(import.meta);

const { InventionPage } = await loadModule('src/invention-page.mjs');

const { InventionGizmoTableUIComponent } = await loadModule('src/components/invention-gizmo-table.mjs');

class ComponentIcon {
    constructor(parent, containerClasses=[]) {
        this.parent = parent;
        this.container = createElement('div', {
            classList: ['bank-item', 'no-bg', 'pointer-enabled', `resize-48`, 'btn-light', ...containerClasses],
        });
        this.image = this.container.appendChild(createElement('img', {
            classList: ['bank-img', 'p-2', `resize-48`, 'd-none'],
            parent: this.container,
        }));
        this.text = this.container.appendChild(createElement('div', {
            classList: ['font-size-sm', 'text-white', 'text-center', 'd-none'],
        })).appendChild(createElement('small', {
            classList: ['badge-pill', 'bg-secondary'],
        }));
        this.tooltip = tippy(this.container, {
            content: 'Empty',
            placement: 'top',
            allowHTML: true,
            interactive: false,
            animation: false,
        });
        parent.appendChild(this.container);
    }
    setImage(media) {
        this.image.src = media;
    }
    setText(text) {
        this.text.textContent = text;
    }
    setTooltip(content) {
        this.tooltip.setContent(content);
    }
    destroy() {
        this.tooltip.destroy();
        this.parent.removeChild(this.container);
    }
    hide() {
        this.container.classList.add('d-none');
    }
    show() {
        this.container.classList.remove('d-none');
    }
    invisible() {
        this.container.classList.add('invisible');
    }
    visible() {
        this.container.classList.remove('invisible');
    }
    setItem(item) {
        this.item = item;

        if(this.item !== undefined) {
            this.setImage(this.item.media);
            this.image.classList.remove('d-none');
            if(this.item.type === "Parts") {
                this.setText(5);
                this.text.parentElement.classList.remove('d-none');
            } else if (this.item.type === "Components") {
                this.setText();
                this.text.parentElement.classList.add('d-none');
            }
        } else {
            this.setImage();
            this.image.classList.add('d-none');
            this.setText();
            this.text.parentElement.classList.add('d-none');
        }
        this.setTooltip(this.getTooltipContent());
    }
    setCallback(callback) {
        this.container.onclick = callback;
    }
    getName() {
        if(this.item !== undefined)
            return this.item.name;
        return 'Empty';
    }
    getTooltipContent() {
        let desc = '';
        if(this.item !== undefined && this.item.hasDescription)
            desc =  `<small>${this.item.description}</small>`;
        let tt = `<div class="text-center">${this.getName()}${desc}</div>`;
        return tt;
    }
}

class ComponentsBox {
    constructor(parent, containerClasses=[]) {
        this.parent = parent;
        this.icons = [];
        this.container = createElement('div', {
            classList: containerClasses
        });
        const nameHeader = createElement('h5', {
            classList: ['font-w600', 'font-size-sm', 'mb-1', 'text-center'],
            parent: this.container,
        });
        this.name = nameHeader;
        this.centerContainer = createElement('div', {
            classList: ['row', 'justify-content-center'],
            parent: this.container,
        });
        this.iconContainer = createElement('div', {
            attributes: [["style", "display: grid; grid-gap: 10px; grid-template-rows: repeat(3, 48px); grid-template-columns: repeat(3, 48px);"]],
            parent: this.centerContainer
        });

        this.slots = new Map();
        createElement('div', { parent: this.iconContainer });
        this.slots.set('n', new ComponentIcon(this.iconContainer));
        createElement('div', { parent: this.iconContainer });
        this.slots.set('e', new ComponentIcon(this.iconContainer));
        this.slots.set('c', new ComponentIcon(this.iconContainer));
        this.slots.set('w', new ComponentIcon(this.iconContainer));
        createElement('div', { parent: this.iconContainer });
        this.slots.set('s', new ComponentIcon(this.iconContainer));
        createElement('div', { parent: this.iconContainer });
        parent.append(this.container);
        
        this.size = 48;
        this.localize();
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
    getComponents() {
        return [
            this.slots.get('c').item,
            this.slots.get('n').item,
            this.slots.get('e').item,
            this.slots.get('w').item,
            this.slots.get('s').item
        ].filter(Boolean);
    }
    setName(name) {
        this.name.textContent = name;
    }
    localize() {
        this.setName("Components");
        this.icons.forEach((icon)=>icon.localize());
    }
}
class PerksBox {
    constructor(parent, containerClasses=[]) {
        this.container = createElement('div', {
            classList: containerClasses
        });
        this.budget = createElement('h5', {
            classList: ['font-w600', 'mb-1', 'text-center'],
            parent: this.container,
        });
        this.name = createElement('h5', {
            classList: ['font-w600', 'font-size-sm', 'mb-1', 'text-center'],
            parent: this.container,
        });
        this.centerContainer = createElement('div', {
            classList: ['row', 'justify-content-center'],
            parent: this.container,
        });
        this.perksContainer = createElement('div', {
            parent: this.centerContainer
        });
        parent.append(this.container);
        this.localize();
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
    setName(name) {
        this.name.textContent = name;
    }
    setBudget(budget) {
        this.budget.textContent = budget;
    }
    setPerks(perks) {
        this.perksContainer.innerHTML = `<div class="row no-gutters"><small>
            ${perks.sort((a,b) => a.high === b.high ? a.perk.name.localeCompare(b.perk.name) : b.high - a.high).filter(perk => perk.lowRank !== undefined || perk.highRank !== undefined).map(({ perk, low, lowRank, high, highRank, roll, rollRank }) => {
                if(lowRank === undefined)
                    lowRank = perk.ranks[0];
                let rankRange = lowRank !== highRank ? `${lowRank.rank}-${highRank.rank}` : highRank.rank;
                let costRange = lowRank !== highRank ? perk.ranks.slice(perk.ranks.indexOf(lowRank), perk.ranks.indexOf(highRank)+1).map(rank => rank.cost).join('/') : highRank.cost;
                let name = `${perk.name} Rank ${rankRange} (${costRange})`;
                return `<div class="col-12"><span class="text-success">${name}</span></div>`
            }).join('')}
        </small></div>`;
    }
    localize() {
        let { low, high } = game.invention.getBudget(false);
        this.setName("Possible Perks (cost)");
        this.setBudget(`Budget: ${low}-${high}`);
    }
}

class InventionGizmoTableMenu extends ArtisanMenu { // Remove Mastery Shit
    constructor(gizmo_table) {
        super('invention-gizmo-table-artisan-container', gizmo_table.manager);
        this.gizmo_table = gizmo_table;
        this.productDropdownCont = createElement('div', {
            classList: ['col-12', 'p-0']
        });
        this.productName.parentElement.after(this.productDropdownCont);
        this.productDropdown = new DropDown(this.productDropdownCont, 'gizmo-recipe-dropdown',['btn-sm', 'btn-primary'],['font-size-sm'],true,60);
        hideElement(this.productName.parentElement);
        hideElement(this.buffsContainer);
        hideElement(this.masteryCol);
        this.requires.container.classList.add('pr-4');
        this.haves.container.classList.add('pl-4');
        this.produces.hide();
        this.grants.container.classList.remove('col-sm-6');

        let blockClasses = ['block', 'block-rounded-double', 'bg-combat-inner-dark'];
        let colClasses = ['col-12', ...blockClasses];
        const boxClasses = ['col-12', 'pb-2'];

        let disassembleCol = createElement('div', {
            classList: [...colClasses, 'pt-2', 'pb-1', 'text-center']
        });
        let disassembleRow = createElement('div', {
            classList: ['row', 'no-gutters'],
            parent: disassembleCol
        });
        this.ingredientsCol.before(disassembleCol);

        
        let perksCol = createElement('div', {
            classList: [...colClasses, 'pt-2', 'pb-1', 'text-center']
        });
        let perksRow = createElement('div', {
            classList: ['row', 'no-gutters'],
            parent: perksCol
        });
        this.ingredientsCol.before(perksCol);
        this.perks = new PerksBox(perksRow, boxClasses);

        this.components = new ComponentsBox(disassembleRow, boxClasses);
        this.components.slots.forEach((icon, slot) => {
            icon.setCallback(() => {
                icon.setItem(this.gizmo_table.selectedComponent);
                this.gizmo_table.renderQueue.recipeInfo = true;
            });
        });
        //this.junkChance = new JunkBox(disassembleRow, false, boxClasses);
        //this.junkChance.setJunk(this.disassemble.game.items.getObjectByID('invention:Junk'));
        //this.junkChance.setSelected();
    }
    populateDropdown(recipes, selectCallback) {
        if(this.gizmo_table.selectedGizmo === undefined)
            this.productDropdown.setButtonText(getLangString('MENU_TEXT_SELECT_RECIPE'));
        this.productDropdown.clearOptions();
        recipes.forEach(recipe => {
            const altRecipeContainer = createElement('div', {
                classList: ['row', 'gutters-tiny'],
            });
            const gizmoNameContainer = createElement('h5', {
                classList: ['font-w700', 'text-left', 'text-combat-smoke', 'm-1'],
                parent: altRecipeContainer
            })
            const gizmoText = gizmoNameContainer.appendChild(createElement('small', {
                classList: ['mr-2'],
                text: recipe.name
            }));
            this.productDropdown.addOption([altRecipeContainer], () => selectCallback(recipe));
        })
    }
    setGizmo(recipe) {
        if(recipe !== undefined) {
            this.components.show();
            this.productDropdown.setButtonText(recipe.name);
            this.setSelected(recipe);
        } else {
            this.components.hide();
            this.productDropdown.setButtonText(getLangString('MENU_TEXT_SELECT_RECIPE'));
            this.setUnselected(recipe);
        }
    }
    setUnselected() {
        this.requires.setUnselected();
        this.haves.setUnselected();
        this.grants.setUnselected();
        this.produces.setUnselected();
        showElement(this.selectedText);
        this.productIcon.hide();
        this.updateInterval(0);
        hideElement(this.viewStatsText);
        this.productDescription.innerHTML = '';
        this.product = undefined;
        this.productImage.src = this.skill.media;
        this.productQuantity.textContent = '-';
        this.productName.textContent = '-';
        this.noneSelected = true;
    }

    localize() {
        super.localize();
        this.perks.localize();
        this.createText.textContent = 'Fill Gizmo';
        this.createButton.textContent = 'Fill Gizmo';
    }
}

class ItemComponentIcon extends ItemQtyIcon {
    constructor(parent) {
        super(parent);
    }

    localize() {
        this.setTooltip(this.getTooltipContent());
        this.setText(numberWithCommas(this.getCurrentQty()));
    }
    updateQty() {
        this.qty = this.getCurrentQty();
        this.setText(numberWithCommas(this.getCurrentQty()));
    }
    setCallback(callback) {
        this.container.onclick = callback;
    }
    getTooltipContent() {
        let desc = '';
        if(this.item !== undefined && this.item.hasDescription)
            desc =  `<small>${this.item.description}</small>`;
        let tt = `<div class="text-center">${this.getName()}${desc}</div>`;
        return tt;
    }
}

class InventionGizmoTableTab {
    constructor(gizmo_table) {
        this.gizmo_table = gizmo_table;
        this.container = document.getElementById('invention-gizmo-table-item-selection-container');
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
    setSelected(item) {
        let old = this.icons.find(icon => icon.container.classList.contains('bg-easy-task'));
        if(old !== undefined)
            old.container.classList.remove('bg-easy-task');
        let icon = this.icons.find(icon => icon.item === item);
        if(icon !== undefined)
            icon.container.classList.add('bg-easy-task');
    }
    localize() {
        this.icons.forEach((icon)=>icon.localize());
    }
    updateQty() {
        this.icons = this.icons.filter((icon)=> {
            icon.updateQty();
            if(icon.qty <= 0) {
                icon.destroy();
                return false;
            }
            return true;
        });
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
            if(icon !== undefined) {
                icon.updateQty();
            } else {
                if(!this.gizmo_table.manager.isComponent(item))
                    return;
                let icon = new ItemComponentIcon(this.container);
                icon.setItem(item, game.bank.getQty(item));
                icon.setCallback(()=>this.gizmo_table.selectItemOnClick(item));
                if(item === this.gizmo_table.selectedComponent)
                    icon.container.classList.add('bg-easy-task');
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
        let items = game.bank.filterItems(bankItem => this.gizmo_table.manager.isComponent(bankItem.item));
        items.forEach((item)=>{
            this.updateItem(item);
        });
        this.localize();
    }
}

class InventionGizmoTableRenderQueue {
    constructor(){
        this.selectedComponent = false;
        this.recipeInfo = false;
        this.quantities = false;
        this.progressBar = false;
        this.icons = new Set();
    }
    updateAll() {
        this.selectedComponent = true;
        this.recipeInfo = true;
        this.quantities = true;
        this.progressBar = true;
    }
}

export class InventionGizmoTable extends InventionPage {
    constructor(manager, game) {
        super(manager, game);

        this.component = new InventionGizmoTableUIComponent();
        this.renderQueue = new InventionGizmoTableRenderQueue();
        this.baseInterval = 5000;
        this.actionTimer = new Timer('Skill',()=>this.action());
        this.shouldResetAction = false;
        this.baseXP = 5;
        this.gizmos = [];
    }

    onLoad() {
        super.onLoad();
        this.selectionTab.updateItems();
        this.menu.populateDropdown(this.gizmos, (gizmo) => {
            this.gizmoDropdownClick(gizmo);
        });
        this.menu.localize();
        this.menu.setCreateCallback(()=>this.gizmoButtonOnClick());
        this.renderQueue.updateAll();
    }

    onShow() {
        this.menu.localize();
        this.selectionTab.updateItems();
        this.renderQueue.quantities = true;
    }

    onHide() {
        super.onHide();
    }

    postDataRegistration() {
        this.gizmos = [
            this.game.items.getObjectByID('invention:Weapon_Gizmo'),
            this.game.items.getObjectByID('invention:Armour_Gizmo')
        ]
    }

    initMenus() {
        this.menu = new InventionGizmoTableMenu(this);
        this.selectionTab = new InventionGizmoTableTab(this);
    }

    activeTick() {
        this.actionTimer.tick();
    }

    getCurrentGizmoCosts() {
        return this.getGizmoCosts(this.selectedGizmo, this.menu.components.getComponents());
    }

    getGizmoCosts(item, components=[]) {
        const costs = new Costs(this.game);
        if(this.selectedGizmo !== undefined) {
            costs.addItem(this.manager.getShellFromProduct(this.selectedGizmo), 1);
            components.forEach(component => {
                if(component.type === "Parts") {
                    costs.addItem(component, 5);
                } else if (component.type === "Components") {
                    costs.addItem(component, 1);
                }
            });
        }

        return costs;
    }

    gizmoDropdownClick(gizmo) {
        this.selectedGizmo = gizmo;
        this.renderQueue.recipeInfo = true;
    }

    gizmoButtonOnClick() {
        if(this.manager.isActive && !this.actionTimer.isActive)
            this.manager.stop();
        
        if(this.manager.isActive) {
            this.manager.stop();
        } else if(this.selectedGizmo !== undefined) {
            if(this.getCurrentGizmoCosts().checkIfOwned()) {
                this.start();
            } else {
                notifyPlayer(this.manager, "You don't have the required materials to fill a gizmo.", 'danger');
            }
        }
    }

    selectItemOnClick(item) {
        if(this.selectedComponent === item) {
            this.selectedComponent = undefined;
        } else {
            this.selectedComponent = item;
        }
        this.renderQueue.selectedComponent = true;
        this.render();
    }

    start() {
        if (!this.manager.canStart)
            return false;

        this.startActionTimer();
        
        return this.manager.start();
    }

    stop() {
        if(!this.manager.canStop)
            return false;
            
        this.actionTimer.stop();
        this.renderQueue.progressBar = true;
        
        return true;
    }

    startActionTimer() {
        this.actionTimer.start(this.baseInterval);
        this.renderQueue.progressBar = true;
    }
    preAction() { }
    action() {
        const disassembleCosts = this.getCurrentGizmoCosts();
        if (!disassembleCosts.checkIfOwned()) {
            notifyPlayer(this.manager, "You don't have the required materials to fill this gizmo.", 'danger');
            this.manager.stop()
            return;
        }
        let notAllGiven = this.addActionRewards(this.selectedGizmo);
        if(notAllGiven)
            return;
        this.preAction();
        disassembleCosts.consumeCosts();
        this.postAction();

        this.manager.stop();
    }
    postAction() {
        this.renderQueue.recipeInfo = true;
        this.renderQueue.quantities = true;
    }
    addActionRewards(item) {
        const rewards = this.actionRewards;
        let { budget, perks, chosen, gizmo } = this.manager.createGizmo(item, this.menu.components.getComponents());
        if(gizmo === undefined) {
            notifyPlayer(this.manager, `Didn't roll any perks. Perk budget was ${budget}.`, 'danger');
            this.manager.stop();
            return;
        }
        rewards.addItem(gizmo, 1);
        rewards.setSource(`Skill.${this.manager.id}`);
        const notAllGiven = rewards.giveRewards();
        if(notAllGiven) {
            notifyPlayer(this.manager, "No space for your Gizmo", 'danger');
            this.manager.removeGizmo(gizmo);
        } else {
            let perkString = chosen.map(({perk, rank, roll}) => `${perk.name} Rank ${rank} (${roll})`).join(', ');
            notifyPlayer({media: gizmo.media}, `Perk budget: ${budget}. ${perkString}`, 'info', 0);
            //game.notifications.createInfoNotification(gizmo.id, [...gizmo.perks].map(([perk, rank]) => `${perk.name} Rank ${rank}`).join(', '), gizmo.media, 0);
        }
        return notAllGiven;
    }
    get actionRewards() {
        const rewards = new Rewards(this.game);
        rewards.addXP(this.manager, this.baseXP);
        
        //this.addCommonRewards(rewards);
        return rewards;
    }

    resetActionState() {
        if (this.manager.isActive)
            this.game.clearActionIfActiveOrPaused(this);
        this.manager.isActive = false;
        this.actionTimer.stop();
    }
    queueBankQuantityRender(item) {
        this.renderQueue.icons.add(item);
        this.renderQueuequantities = true;
    }

    render() {
        this.renderSelectedComponent();
        super.render();
        this.renderQuantities();
        this.renderIcons();
        this.renderItemInfo();
        this.renderProgressBar();
    }
    renderIcons() {
        if(!this.renderQueue.icons.size > 0)
            return;
        this.renderQueue.icons.forEach(icon => this.selectionTab.updateItem(icon));
        this.renderQueue.icons.clear();
    }
    renderQuantities() {
        if (!this.renderQueue.quantities)
            return;
        this.menu.updateQuantities();
        this.renderQueue.quantities = false;
    }
    renderSelectedComponent() {
        if (!this.renderQueue.selectedComponent)
            return;
        if (this.selectedComponent !== undefined) {
            this.selectionTab.setSelected(this.selectedComponent);
            this.renderQueue.recipeInfo = true;
        } else {
            this.selectionTab.setSelected();
        }
        this.renderQueue.selectedComponent = false;
    }
    renderItemInfo() {
        if (!this.renderQueue.recipeInfo)
            return;
        this.menu.setGizmo(this.selectedGizmo);
        const costs = this.getCurrentGizmoCosts();
        this.menu.setIngredients(costs.getItemQuantityArray(), costs.gp, costs.sc);
        this.menu.updateGrants(this.manager.modifyXP(this.baseXP), this.baseXP, 0, 0, 0);
        this.menu.grants.hideMastery();
        this.menu.updateChances(0, 0);
        this.menu.updateInterval(this.baseInterval);

        let type = this.manager.getPerkTypeFromGizmo(this.selectedGizmo);
        if(type !== undefined)
            this.menu.perks.setPerks(this.manager.possiblePerks(type, this.menu.components.getComponents()));
        this.renderQueue.recipeInfo = false;
    }
    renderProgressBar() {
        if (!this.renderQueue.progressBar)
            return;
        if (this.actionTimer.isActive) {
            this.menu.animateProgressFromTimer(this.actionTimer);
        } else {
            this.menu.stopProgressBar();
        }
        this.renderQueue.progressBar = false;
    }

    encode(writer) {
        this.actionTimer.encode(writer);
        return writer;
    }

    decode(reader, version) {
        this.actionTimer.decode(reader, version);
        if (this.shouldResetAction)
            this.resetActionState();
    }
}