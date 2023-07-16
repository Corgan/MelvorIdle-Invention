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
        this.setText(numberWithCommas(this.getCurrentQty()));
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

class DecimalXPIcon extends XPIcon {
    setXP(xp, baseXP) {
        this.xp = xp.toFixed(1) % 1 != 0 ? xp.toFixed(1) : Math.floor(xp);
        this.baseXP = baseXP.toFixed(1) % 1 != 0 ? baseXP.toFixed(1) : Math.floor(baseXP);
        this.setText(`${this.xp}`);
        this.localize();
    }
}

class InventionDisassembleMenu extends ArtisanMenu { // Remove Mastery Shit
    constructor(disassemble) {
        super('invention-disassemble-artisan-container', disassemble.manager);
        this.disassemble = disassemble;
        hideElement(this.buffsContainer);
        hideElement(this.masteryCol);
        this.produces.hide();
        this.grants.xpIcon.destroy();
        this.grants.icons.splice(this.grants.icons.indexOf(this.grants.xpIcon), 1)
        this.grants.xpIcon = new DecimalXPIcon(this.grants.iconContainer,69,69,48);
        this.grants.addIcon(this.grants.xpIcon);
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
        this.createButton.parentElement.parentElement.style = "align-items: center;";
        this.siphonSwitch = new SettingsSwitchElement();
        this.siphonSwitch.initialize({
            currentValue: false,
            name: "Siphon"
        },
        () => {
            this.disassemble.renderQueue.selectedItem = true;
        });
        this.siphonSwitch.setAttribute('data-size', 'large');
        this.createButton.parentElement.before(this.siphonSwitch);
        hideElement(this.siphonSwitch);
    }
    setSelected(recipe) {
        if(this.disassemble.manager.isAugmentedItem(recipe)) {
            showElement(this.siphonSwitch);
        } else {
            hideElement(this.siphonSwitch);
        }
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
        if(!this.disassemble.shouldSiphon) {
            this.junkChance.setChance(this.disassemble.manager.getJunkChanceForItem(item));
            let table = this.disassemble.manager.getDropTableForItem(item);
            this.materials.setMaterialCount(this.disassemble.manager.getMaterialCountForItem(item));

            let items = table.getChances();
            this.materials.setItems(items);
        } else {
            this.junkChance.setChance(0);
            this.materials.setMaterialCount(0);
            this.materials.setItems([]);
        }
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
    updateItem(item) {
        let icon = this.icons.find(i => i.item === item);
        let qty = game.bank.getQty(item);
        if(qty > 0) {
            if(icon !== undefined) {
                icon.updateQty();
            } else {
                if(!this.disassemble.manager.canDisassemble(item) || game.bank.lockedItems.has(item))
                    return;
                let icon = new ItemDisassembleIcon(this.container);
                icon.setItem(item, game.bank.getQty(item));
                icon.setCallback(()=>this.disassemble.selectItemOnClick(item));
                if(item === this.disassemble.selectedItem)
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
        let items = game.bank.unlockedItemArray.filter(item => this.disassemble.manager.canDisassemble(item));
        items.forEach((item)=>{
            this.updateItem(item);
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
        this.icons = new Set();
    }
    updateAll() {
        this.selectedItem = true;
        this.recipeInfo = true;
        this.quantities = true;
        this.progressBar = true;
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
        this.selectionTab.updateItems();
        this.renderQueue.quantities = true;
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

    activeTick() {
        this.actionTimer.tick();
    }

    disassembleButtonOnClick() {
        if(this.manager.isActive && !this.actionTimer.isActive)
            this.manager.stop();
        
        if(this.manager.isActive) {
            this.manager.stop();
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
        if(item !== this.selectedItem && this.actionTimer.isActive && !this.manager.stop())
            return;
        this.selectedItem = item;
        this.renderQueue.selectedItem = true;
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
        const disassembleCosts = this.getCurrentDisassembleCosts();
        if (!disassembleCosts.checkIfOwned()) {
            this.game.combat.notifications.add({
                type: 'Player',
                args: [this, this.noCostsMessage, 'danger']
            });
            this.manager.stop();
            return;
        }
        const continueSkill = this.addActionRewards(this.selectedItem);
        this.preAction();
        disassembleCosts.consumeCosts();
        this.postAction();

        const nextCosts = this.getCurrentDisassembleCosts();
        if (nextCosts.checkIfOwned() && continueSkill && !this.shouldSiphon) {
            this.startActionTimer();
        } else {
            this.game.combat.notifications.add({
                type: 'Player',
                args: [this.manager, this.noCostsMessage, 'danger']
            });
            this.manager.stop();
            this.selectedItem = undefined;
            this.renderQueue.selectedItem = true;
        }
    }
    postAction() {
        this.renderQueue.recipeInfo = true;
        this.renderQueue.quantities = true;
    }
    getCurrentDisassembleCosts() {
        return this.getDisassembleCosts(this.selectedItem);
    }
    getDisassembleCosts(item) {
        const costs = new Costs(this.game);
        if(this.manager.isAugmentedItem(this.selectedItem) && this.menu.siphonSwitch.input.checked) {
            let siphon = this.game.items.getObjectByID('invention:Equipment_Siphon');
            costs.addItem(siphon, 1);
        } else {
            let count = this.manager.getRequiredCountForItem(item);
            costs.addItem(item, count);
        }

        return costs;
    }
    get shouldSiphon() {
        return this.manager.isAugmentedItem(this.selectedItem) && this.menu.siphonSwitch.input.checked;
    }
    get currentXP() {
        if(this.selectedItem === undefined)
            return 0;
        let level = this.manager.getItemLevel(this.selectedItem);
        let xp = this.selectedItem instanceof EquipmentItem ? level * 0.3 : Math.floor(Math.max(1, level * 0.3)) / 10;
        if(this.manager.isAugmentedItem(this.selectedItem)) {
            xp = this.manager.equipment_reward[Math.max(0, Math.min(this.selectedItem.level - (this.shouldSiphon ? 2 : 0), this.manager.equipment_reward.length) - 1)];
            xp *= 1 + (1.5 * ((Math.max(15, level) - 80) / 100));
        }
        return xp;
    }
    addActionRewards(item) {
        const rewards = this.actionRewards;
        rewards.setSource(`Skill.${this.manager.id}`);
        const notAllGiven = rewards.giveRewards();
        return !(notAllGiven && !this.game.settings.continueIfBankFull);
    }
    get actionRewards() {
        const rewards = new Rewards(this.game);
        rewards.addXP(this.manager, this.currentXP);

        if(!this.shouldSiphon) {
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
        this.renderQueue.icons.add(item);
        this.quantities = true;
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
        this.menu.updateGrants(this.manager.modifyXP(this.currentXP), this.currentXP, 0, 0, 0);
        this.menu.grants.hideMastery();
        this.menu.updateChances(0, 0);
        this.menu.updateInterval(this.baseInterval);
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