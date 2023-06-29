const { loadModule } = mod.getContext(import.meta);

const { InventionPage } = await loadModule('src/invention-page.mjs');

const { InventionDisassembleUIComponent } = await loadModule('src/components/invention-disassemble.mjs');

class JunkBox extends IconBox {
    constructor(parent, smallName, containerClasses=[], iconContClasses=[]) {
        super(parent, smallName, containerClasses, iconContClasses);
        this.size = 48;
        this.reqIcon = new ItemChanceIcon(this.iconContainer, this.size);
        this.localize();
    }
    setUnselected() {
        super.setUnselected();
        this.reqIcon.hide();
    }
    setJunk(junk) {
        this.reqIcon.setItem(junk);
        this.reqIcon.show();
    }
    setChance(chance) {
        this.reqIcon.setChance(chance);
    }
    localize() {
        super.localize();
        this.setName('Junk Chance');
    }
}
class MaterialsBox extends IconBox {
    constructor(parent, smallName, containerClasses=[], iconContClasses=[]) {
        super(parent, smallName, containerClasses, iconContClasses);
        this.size = 48;
        this.localize();
    }
    setItems(items) {
        this.destroyIcons();
        items.forEach(({item, chance})=>{
            const reqIcon = new ItemChanceIcon(this.iconContainer, this.size);
            reqIcon.setItem(item);
            reqIcon.setChance(chance);
            this.addIcon(reqIcon);
        }
        );
    }
    setUnselected() {
        super.setUnselected();
        this.setName("Produces - parts");
    }
    setMaterialCount(count) {
        this.setName(`Produces ${count} parts`);
    }
    localize() {
        super.localize();
        this.setName("Produces - parts");
    }
}

class ItemDisassembleIcon extends ItemQtyIcon {
    constructor(parent) {
        super(parent);
    }

    localize() {
        this.setTooltip(this.getTooltipContent());
        this.setText(numberWithCommas(this.getCurrentQty()));
    }
    updateQty() {
        this.qty = this.getCurrentQty();
        this.setText(this.qty);
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

class InventionDisassembleMenu extends ArtisanMenu { // Remove Mastery Shit
    constructor(disassemble) {
        super('invention-disassemble-artisan-container', disassemble.manager);
        this.disassemble = disassemble;
        hideElement(this.buffsContainer);
        hideElement(this.masteryCol);
        this.produces.hide();
        this.grants.container.classList.remove('col-sm-6');

        let blockClasses = ['block', 'block-rounded-double', 'bg-combat-inner-dark'];
        let colClasses = ['col-12', ...blockClasses];
        let disassembleCol = createElement('div', {
            classList: [...colClasses, 'pt-2', 'pb-1', 'text-center']
        });
        let disassembleRow = createElement('div', {
            classList: ['row', 'no-gutters'],
            parent: disassembleCol
        });
        this.productsCol.before(disassembleCol);

        const boxClasses = ['col-12', 'col-sm-6', 'pb-2'];
        this.materials = new MaterialsBox(disassembleRow, false, boxClasses);
        this.junkChance = new JunkBox(disassembleRow, false, boxClasses);
        this.junkChance.setJunk(this.disassemble.game.items.getObjectByID('invention:Junk'));
        this.junkChance.setSelected();
    }
    setSelected(recipe) {
        if (this.noneSelected) {
            this.junkChance.setSelected();
            this.materials.setSelected();
        }
        super.setSelected(recipe);
    }
    setUnselected() {
        this.requires.setUnselected();
        this.haves.setUnselected();
        this.grants.setUnselected();
        this.produces.setUnselected();
        this.junkChance.setUnselected();
        this.materials.setUnselected();
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

    setProduct(item) {
        super.setProduct(item, 0);
        this.junkChance.setJunk(this.disassemble.game.items.getObjectByID('invention:Junk'));
        this.junkChance.setChance(this.disassemble.manager.getJunkChanceForItem(item));
        let table = this.disassemble.manager.getDropTableForItem(item);
        this.materials.setMaterialCount(this.disassemble.manager.getMaterialCountForItem(item));

        let items = table.getChances();
        this.materials.setItems(items);
    }

    localize() {
        super.localize();
        this.createText.textContent = 'Disassemble';
        this.createButton.textContent = 'Disassemble';
    }
}

class InventionDisassembleTab extends ContainedComponent {
    constructor(disassemble) {
        super();
        this.disassemble = disassemble;
        this.container = document.getElementById('invention-disassemble-item-selection-container');
        this.icons = [];
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
    updateItems() {
        this.destroyIcons();
        let items = game.bank.unlockedItemArray.filter(item => this.disassemble.manager.canDisassemble(item));
        items.forEach((item)=>{
            let icon = new ItemDisassembleIcon(this.container);
            icon.setItem(item, game.bank.getQty(item));
            icon.setCallback(()=>this.disassemble.selectItemOnClick(item));
            if(item === this.disassemble.selectedItem)
                icon.container.classList.add('bg-easy-task');
            this.icons.push(icon);
        });
        this.localize();
    }
}

class InventionDisassembleRenderQueue {
    constructor(){
        this.selectedItem = false;
        this.recipeInfo = false;
        this.quantities = false;
        this.progressBar = false;
        this.icons = false;
    }
    updateAll() {
        this.selectedItem = true;
        this.recipeInfo = true;
        this.quantities = true;
        this.progressBar = true;
        this.icons = true;
    }
}

export class InventionDisassemble extends InventionPage {
    constructor(manager, game) {
        super(manager, game);

        this.component = new InventionDisassembleUIComponent();
        this.renderQueue = new InventionDisassembleRenderQueue();
        this.baseInterval = 1000;
        this.actionTimer = new Timer('Skill',()=>this.action());
        this.shouldResetAction = false;
        this.baseXP = 5;
    }

    onLoad() {
        super.onLoad();
        this.selectionTab.updateItems();
        this.menu.localize();
        this.menu.setCreateCallback(()=>this.disassembleButtonOnClick());
        this.renderQueue.updateAll();
    }

    onLevelUp() {
    }

    onShow() {
        if(game.bank.getQty(this.selectedItem) === 0)
            this.selectItemOnClick();
    }

    onHide() {
        super.onHide();
    }

    postDataRegistration() {

    }

    initMenus() {
        this.menu = new InventionDisassembleMenu(this);
        this.selectionTab = new InventionDisassembleTab(this);
    }

    getCurrentDisassembleCosts() {
        return this.getDisassembleCosts(this.selectedItem);
    }

    getDisassembleCosts(item) {
        const costs = new Costs(this.game);
        let count = this.manager.getRequiredCountForItem(item);
        costs.addItem(item, count);

        return costs;
    }

    activeTick() {
        this.actionTimer.tick();
    }
    

    disassembleButtonOnClick() {
        if(this.manager.isActive) {
            this.stop();
        } else if(this.selectedItem !== undefined) {
            if(this.getCurrentDisassembleCosts().checkIfOwned()) {
                this.start();
            } else {
                notifyPlayer(this, this.noCostsMessage, 'danger');
            }
        }
    }
    get noCostsMessage() {
        return getLangString('TOASTS_MATERIALS_REQUIRED_TO_SMITH');
    }

    selectItemOnClick(item) {
        if(item !== this.selectedItem && this.manager.isActive && !this.stop())
            return;
        this.selectedItem = item;
        this.renderQueue.selectedItem = true;
        this.render();
    }

    get canStop() {
        return this.manager.isActive && !this.game.isGolbinRaid;
    }

    get canStart() {
        return !this.game.idleChecker(this);
    }

    start() {
        if (!this.canStart)
            return false;
        
        this.manager.isActive = true;
        this.game.renderQueue.activeSkills = true;
        this.startActionTimer();
        this.game.activeAction = this.manager;
        this.game.scheduleSave();

        saveData();
        return true;
    }

    stop() {
        if(!this.canStop)
            return false;
            
        this.manager.isActive = false;
        this.actionTimer.stop();
        this.renderQueue.progressBar = true;
        this.game.renderQueue.activeSkills = true;
        this.game.clearActiveAction(false);
        this.game.scheduleSave();

        saveData();
        return true;
    }

    startActionTimer() {
        this.actionTimer.start(this.baseInterval);
        this.renderQueue.progressBar = true;
    }
    preAction() { }
    action() {
        const disassembleCosts = this.getCurrentDisassembleCosts();
        if (!disassembleCosts.checkIfOwned()) {
            this.game.combat.notifications.add({
                type: 'Player',
                args: [this, this.noCostsMessage, 'danger']
            });
            this.stop();
            return;
        }
        const continueSkill = this.addActionRewards(this.selectedItem);
        this.preAction();
        disassembleCosts.consumeCosts();
        this.postAction();

        const nextCosts = this.getCurrentDisassembleCosts();
        if (nextCosts.checkIfOwned() && continueSkill) {
            this.startActionTimer();
        } else {
            this.game.combat.notifications.add({
                type: 'Player',
                args: [this.manager, this.noCostsMessage, 'danger']
            });
            this.stop();
            this.selectedItem = undefined;
            this.renderQueue.selectedItem = true;
        }
    }
    postAction() {
        this.renderQueue.recipeInfo = true;
        this.renderQueue.quantities = true;
    }
    addActionRewards(item) {
        const rewards = this.actionRewards;
        rewards.setSource(`Skill.${this.manager.id}`);
        const notAllGiven = rewards.giveRewards();
        return !(notAllGiven && !this.game.settings.continueIfBankFull);
    }
    get actionRewards() {
        const rewards = new Rewards(this.game);

        let count = this.manager.getMaterialCountForItem(this.selectedItem);
        let junk = this.manager.getJunkChanceForItem(this.selectedItem);
        let table = this.manager.getDropTableForItem(this.selectedItem);

        for(let i=0; i<count; i++) {
            if(Math.floor(Math.random()*100) < junk) {
                rewards.addItem(this.game.items.getObjectByID('invention:Junk'), 1);
            } else {
                let { item, quantity } = table.getDrop();
                rewards.addItem(item, quantity);
            }
        }

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
        this.renderQueue.items.push(item);
        this.renderQueue.quantities = true;
        if(this.game.bank.getQty(item) <= 1)
            this.renderQueue.icons = true;
    }

    render() {
        this.renderSelectedItem();
        super.render();
        this.renderQuantities();
        this.renderIcons();
        this.renderItemInfo();
        this.renderProgressBar();
    }
    renderIcons() {
        if(!this.renderQueue.icons)
            return;
        this.selectionTab.updateItems();
        this.renderQueue.icons = false;
    }
    renderQuantities() {
        if (!this.renderQueue.quantities)
            return;
        this.menu.updateQuantities();
        this.selectionTab.updateQty();
        this.renderQueue.quantities = false;
    }
    renderSelectedItem() {
        if (!this.renderQueue.selectedItem)
            return;
        if (this.selectedItem !== undefined) {
            this.menu.setSelected(this.selectedItem);
            this.selectionTab.setSelected(this.selectedItem);
            this.menu.setProduct(this.selectedItem, 1);
            const costs = this.getCurrentDisassembleCosts();
            this.menu.setIngredients(costs.getItemQuantityArray(), costs.gp, costs.sc);
            this.renderQueue.recipeInfo = true;
        } else {
            this.menu.setUnselected();
            this.selectionTab.setSelected();
            
        }
        this.renderQueue.selectedItem = false;
    }
    renderItemInfo() {
        if (!this.renderQueue.recipeInfo)
            return;
        this.menu.updateGrants(this.manager.modifyXP(this.baseXP), this.baseXP, 0, 0, 0);
        this.menu.grants.hideMastery();
        this.menu.updateChances(0, 0);
        this.menu.updateInterval(this.baseInterval);
        this.renderQueue.recipeInfo = false;
    }
    renderProgressBar() {
        if (!this.renderQueue.progressBar)
            return;
        if (this.manager.isActive) {
            this.menu.animateProgressFromTimer(this.actionTimer);
        } else {
            this.menu.stopProgressBar();
        }
        this.renderQueue.progressBar = false;
    }

    encode(writer) {
        this.actionTimer.encode(writer);
        writer.writeBoolean(this.selectedItem !== undefined);
        if (this.selectedItem !== undefined)
            writer.writeNamespacedObject(this.selectedItem);
        return writer;
    }

    decode(reader, version) {
        this.actionTimer.decode(reader, version);
        if (reader.getBoolean()) {
            const recipe = reader.getNamespacedObject(this.game.items);
            if (typeof recipe === 'string')
                this.shouldResetAction = true;
            else
                this.selectedItem = recipe;
        }
        if (this.shouldResetAction)
            this.resetActionState();
    }
}