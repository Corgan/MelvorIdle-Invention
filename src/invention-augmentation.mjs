const { loadModule } = mod.getContext(import.meta);

const { InventionPage } = await loadModule('src/invention-page.mjs');

const { InventionAugmentationUIComponent } = await loadModule('src/components/invention-augmentation.mjs');


class ItemAugmentationIcon extends ItemQtyIcon {
    constructor(parent) {
        super(parent);
    }
    setCallback(callback) {
        this.container.onclick = callback;
    }
    updateQty() {
        this.qty = this.getCurrentQty();
        this.setText(this.qty);
    }
}


class InventionAugmentationMenu extends ArtisanMenu { // Remove Mastery Shit
    constructor(augmentation) {
        super('invention-augmentation-artisan-container', augmentation.manager);
        this.augmentation = augmentation;
        hideElement(this.buffsContainer);
        hideElement(this.masteryCol);
        this.produces.hide();
        this.grants.container.classList.remove('col-sm-6');
    }

    localize() {
        super.localize();
        this.createText.textContent = 'Augment';
        this.createButton.textContent = 'Augment';
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
}

class InventionAugmentationTab extends ContainedComponent {
    constructor(augmentation) {
        super();
        this.augmentation = augmentation;
        this.container = document.getElementById('invention-augmentation-item-selection-container');
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
    destroyIcons() {
        this.icons.forEach((icon)=>{
            icon.destroy();
        });
        this.icons = [];
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
    updateItems() {
        this.destroyIcons();
        let items = game.bank.unlockedItemArray.filter(item => {
            if(this.augmentation.manager.isAugmentedItem(item))
                return false;
            if(item instanceof WeaponItem)
                return true;
            if(item instanceof EquipmentItem && (item.validSlots.includes('Platebody') || item.validSlots.includes('Platelegs')))
                return true;
            return false;
        });
        items.forEach((item)=>{
            let icon = new ItemAugmentationIcon(this.container);
            icon.setItem(item, game.bank.getQty(item));
            icon.setCallback(()=>this.augmentation.selectItemOnClick(item));
            if(item === this.augmentation.selectedItem)
                icon.container.classList.add('bg-easy-task');
            this.icons.push(icon);
        });
        this.localize();
    }
}

class InventionAugmentationRenderQueue {
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

export class InventionAugmentation extends InventionPage {
    constructor(manager, game) {
        super(manager, game);

        this.component = new InventionAugmentationUIComponent();
        this.renderQueue = new InventionAugmentationRenderQueue();
        this.baseInterval = 10000;
        this.actionTimer = new Timer('Skill',()=>this.action());
        this.shouldResetAction = false;
        this.baseXP = 50;
    }

    onLoad() {
        super.onLoad();
        this.selectionTab.updateItems();
        this.menu.localize();
        this.menu.setCreateCallback(()=>this.augmentButtonOnClick());
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
        this.menu = new InventionAugmentationMenu(this);
        this.selectionTab = new InventionAugmentationTab(this);
    }

    getCurrentAugmentCosts() {
        return this.getAugmentCosts(this.selectedItem);
    }

    getAugmentCosts(item) {
        const costs = new Costs(this.game);
        costs.addItem(item, 1);
        costs.addItem(game.items.getObjectByID('invention:Augmentor'), 1);

        return costs;
    }

    activeTick() {
        this.actionTimer.tick();
    }
    

    augmentButtonOnClick() {
        if(this.manager.isActive) {
            this.stop();
        } else if(this.selectedItem !== undefined) {
            if(this.getCurrentAugmentCosts().checkIfOwned()) {
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
        const augmentCosts = this.getCurrentAugmentCosts();
        if (!augmentCosts.checkIfOwned()) {
            this.game.combat.notifications.add({
                type: 'Player',
                args: [this, this.noCostsMessage, 'danger']
            });
            this.stop();
            return;
        }
        this.addActionRewards(this.selectedItem);
        this.preAction();
        augmentCosts.consumeCosts();
        this.postAction();

        this.stop();
    }
    postAction() {
        this.renderQueue.recipeInfo = true;
        this.renderQueue.quantities = true;
    }
    addActionRewards(item) {
        const rewards = this.actionRewards;
        let augmentedItem = this.manager.createAugmentedItem(item);
        rewards.addItem(augmentedItem, 1);
        rewards.setSource(`Skill.${this.manager.id}`);
        const notAllGiven = rewards.giveRewards();
        if(notAllGiven)
            this.manager.removeAugmentedItem(augmentedItem);
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
            this.selectionTab.setSelected(this.selectedItem);
            this.menu.setSelected(this.selectedItem);
            this.menu.setProduct(this.selectedItem, 1);
            const costs = this.getCurrentAugmentCosts();
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