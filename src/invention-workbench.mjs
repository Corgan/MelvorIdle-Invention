const { loadModule } = mod.getContext(import.meta);

const { InventionPage } = await loadModule('src/invention-page.mjs');

const { InventionWorkbenchUIComponent } = await loadModule('src/components/invention-workbench.mjs');

class InventionWorkbenchArtisanMenu extends ArtisanMenu { // Remove Mastery Shit
    constructor(workbench) {
        super('invention-workbench-artisan-container', workbench.manager);
        this.workbench = workbench;
        hideElement(this.masteryCol);
    }
}

class InventionSelectionTab extends RecipeSelectionTab {
    constructor(workbench) {
        const spells = game.invention.workbench.actions.allObjects.sort((a,b)=>a.level - b.level);
        super(`invention-workbench-category-container`, workbench.manager, spells, `invention-category-0`);
        this.workbench = workbench;
    }
    getRecipeMedia(recipe) {
        return recipe.media;
    }
    getRecipeName(recipe) {
        return recipe.name;
    }
    getRecipeCallback(recipe) {
        return ()=>this.workbench.selectRecipeOnClick(recipe);
    }
    getRecipeIngredients(recipe) {
        return this.workbench.getRecipeCosts(recipe);
    }
}

class InventionWorkbenchRenderQueue {
    constructor(){
        this.details = false;
        this.selectedRecipe = false;
        this.recipeInfo = false;
        this.quantities = false;
        this.progressBar = false;
        this.selectionTabs = false;
    }
    updateAll() {
        this.details = true;
        this.selectedRecipe = true;
        this.recipeInfo = true;
        this.quantities = true;
        this.progressBar = true;
        this.selectionTabs = true;
    }
}

class InventionActionEvent extends SkillActionEvent {
    constructor(skill, action) {
        super();
        this.skill = skill;
        this.action = action;
        this.activePotion = skill.activePotion;
    }
}

export class InventionWorkbench extends InventionPage {
    constructor(manager, game) {
        super(manager, game);

        this.component = new InventionWorkbenchUIComponent();
        this.renderQueue = new InventionWorkbenchRenderQueue();

        this.actions = new NamespaceRegistry(this.game.registeredNamespaces);
        this.baseInterval = 3000;
        this.actionTimer = new Timer('Skill',()=>this.action());
        this.shouldResetAction = false;
    }

    onLoad() {
        super.onLoad();
        this.selectionTab.updateRecipesForLevel();
        this.selectionTab.updateRecipeTooltips();
        this.menu.localize();
        this.menu.setCreateCallback(()=>this.createButtonOnClick());
        this.renderQueue.updateAll();
    }

    onLevelUp() {
        this.selectionTab.updateRecipesForLevel();
        this.selectionTab.updateRecipeTooltips();
    }

    onShow() {
        
    }

    onHide() {
        super.onHide();
    }

    postDataRegistration() {

    }

    initMenus() {
        this.menu = new InventionWorkbenchArtisanMenu(this);
        this.selectionTab = new InventionSelectionTab(this);
    }
    activeTick() {
        this.actionTimer.tick();
    }
    get actionXP() {
        return this.activeRecipe.baseExperience;
    }
    get actionDoublingChance() {
        return this.manager.getDoublingChance(this.masteryAction);
    }
    get actionInterval() {
        return this.modifyInterval(this.baseInterval, this.masteryAction);
    }
    get actionLevel() {
        return this.activeRecipe.level;
    }
    get masteryAction() {
        return this.activeRecipe;
    }
    get currentActionInterval() {
        return this.actionTimer.maxTicks * TICK_INTERVAL;
    }
    getFlatIntervalModifier(action) {
        return (this.game.modifiers.getSkillModifierValue('increasedSkillInterval', this.manager) - this.game.modifiers.getSkillModifierValue('decreasedSkillInterval', this.manager));
    }
    getPercentageIntervalModifier(action) {
        return (this.game.modifiers.getSkillModifierValue('increasedSkillIntervalPercent', this.manager) - this.game.modifiers.getSkillModifierValue('decreasedSkillIntervalPercent', this.manager) + this.game.modifiers.increasedGlobalSkillIntervalPercent - this.game.modifiers.decreasedGlobalSkillIntervalPercent);
    }
    modifyInterval(interval, action) {
        const flatModifier = this.getFlatIntervalModifier(action);
        const percentModifier = this.getPercentageIntervalModifier(action);
        interval *= 1 + percentModifier / 100;
        interval += flatModifier;
        interval = roundToTickInterval(interval);
        return Math.max(interval, 250);
    }
    get actionPreservationChance() {
        return this.getPreservationChance(this.masteryAction, 0);
    }
    getPreservationChance(action, chance) {
        chance += this.game.modifiers.increasedGlobalPreservationChance - this.game.modifiers.decreasedGlobalPreservationChance;
        chance += this.game.modifiers.getSkillModifierValue('increasedSkillPreservationChance', this.manager);
        chance -= this.game.modifiers.getSkillModifierValue('decreasedSkillPreservationChance', this.manager);
        return Math.min(chance, this.getPreservationCap());
    }
    getPreservationCap() {
        const baseCap = 80;
        let modifier = 0;
        modifier += this.game.modifiers.getSkillModifierValue('increasedSkillPreservationCap', this.manager);
        modifier -= this.game.modifiers.getSkillModifierValue('decreasedSkillPreservationCap', this.manager);
        return baseCap + modifier;
    }

    getRecipeCosts(recipe) {
        const costs = new Costs(this.game);
        recipe.itemCosts.forEach(({item, quantity}) => {
            quantity = this.modifyItemCost(item, quantity, recipe);
            if (quantity > 0)
                costs.addItem(item, quantity);
        });

        return costs;
    }

    get activeRecipe() {
        return this.selectedRecipe;
    }
    get noCostsMessage() {
        return getLangString('TOASTS_MATERIALS_REQUIRED_TO_SMITH');
    }

    getCurrentRecipeCosts() {
        return this.getRecipeCosts(this.activeRecipe);
    }

    get actionItem() {
        return this.activeRecipe.product;
    }

    get actionItemQuantity() {
        let quantity = this.activeRecipe.baseQuantity;
        return quantity;
    }

    createButtonOnClick() {
        if(this.manager.isActive) {
            this.stop();
        } else if(this.selectedRecipe !== undefined) {
            if(this.getCurrentRecipeCosts().checkIfOwned()) {
                this.start();
            } else {
                notifyPlayer(this, this.noCostsMessage, 'danger');
            }
        }
    }

    selectRecipeOnClick(recipe) {
        if(recipe !== this.selectedRecipe && this.manager.isActive && !this.stop())
            return;
        this.selectedRecipe = recipe;
        this.renderQueue.selectedRecipe = true;
        this.render();
    }

    modifyItemCost(item, quantity, recipe) {
        return quantity;
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
        this.actionTimer.start(this.actionInterval);
        this.renderQueue.progressBar = true;
    }
    action() {
        const recipeCosts = this.getCurrentRecipeCosts();
        if (!recipeCosts.checkIfOwned()) {
            this.game.combat.notifications.add({
                type: 'Player',
                args: [this, this.noCostsMessage, 'danger']
            });
            this.stop();
            return;
        }
        this.preAction();
        const continueSkill = this.addActionRewards();
        const preserve = rollPercentage(this.actionPreservationChance);
        if (preserve) {
            this.game.combat.notifications.add({
                type: 'Preserve',
                args: [this.manager]
            });
        } else {
            recipeCosts.consumeCosts();
        }
        this.postAction();
        const nextCosts = this.getCurrentRecipeCosts();
        if (nextCosts.checkIfOwned() && continueSkill) {
            this.startActionTimer();
        } else {
            this.game.combat.notifications.add({
                type: 'Player',
                args: [this.manager, this.noCostsMessage, 'danger']
            });
            this.stop();
        }
    }
    addActionRewards() {
        const rewards = this.actionRewards;
        rewards.setSource(`Skill.${this.manager.id}`);
        const notAllGiven = rewards.giveRewards();
        return !(notAllGiven && !this.game.settings.continueIfBankFull);
    }

    preAction() {}
    get actionRewards() {
        const rewards = new Rewards(this.game);
        let qtyToAdd = this.actionItemQuantity;
        if (rollPercentage(this.actionDoublingChance))
            qtyToAdd *= 2;
        qtyToAdd *= Math.pow(2, this.game.modifiers.getSkillModifierValue('doubleItemsSkill', this.manager));
        const itemID = this.actionItem;
        const extraItemChance = this.game.modifiers.getSkillModifierValue('increasedChanceAdditionalSkillResource', this.manager) - this.game.modifiers.getSkillModifierValue('decreasedChanceAdditionalSkillResource', this.manager);
        if (rollPercentage(extraItemChance))
            qtyToAdd++;
        rewards.addItem(itemID, qtyToAdd);
        rewards.addXP(this.manager, this.actionXP);
        //this.addCommonRewards(rewards);
        return rewards;
    }
    postAction() {
        this.renderQueue.recipeInfo = true;
        this.renderQueue.quantities = true;
    }
    resetActionState() {
        if (this.manager.isActive)
            this.game.clearActionIfActiveOrPaused(this);
        this.manager.isActive = false;
        this.actionTimer.stop();
    }

    render() {
        this.renderSelectedRecipe();
        super.render();
        this.renderQuantities();
        this.renderRecipeInfo();
        this.renderProgressBar();
    }
    renderQuantities() {
        if (!this.renderQueue.quantities)
            return;
        this.menu.updateQuantities();
        this.renderQueue.quantities = false;
    }
    renderSelectedRecipe() {
        if (!this.renderQueue.selectedRecipe)
            return;
        if (this.selectedRecipe !== undefined) {
            this.menu.setSelected(this.selectedRecipe);
            this.menu.setProduct(this.actionItem, this.actionItemQuantity);
            const costs = this.getCurrentRecipeCosts();
            this.menu.setIngredients(costs.getItemQuantityArray(), costs.gp, costs.sc);
            this.renderQueue.recipeInfo = true;
        }
        this.renderQueue.selectedRecipe = false;
    }
    renderRecipeInfo() {
        if (!this.renderQueue.recipeInfo)
            return;
        if (this.selectedRecipe !== undefined) {
            this.menu.updateGrants(this.manager.modifyXP(this.actionXP), this.actionXP, 0, 0, 0);
            this.menu.grants.hideMastery();
            this.menu.updateChances(this.actionPreservationChance, this.actionDoublingChance);
            this.menu.updateInterval(this.actionInterval);
        }
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
        writer.writeBoolean(this.selectedRecipe !== undefined);
        if (this.selectedRecipe !== undefined)
            writer.writeNamespacedObject(this.selectedRecipe);
        return writer;
    }

    decode(reader, version) {
        this.actionTimer.decode(reader, version);
        if (reader.getBoolean()) {
            const recipe = reader.getNamespacedObject(this.actions);
            if (typeof recipe === 'string')
                this.shouldResetAction = true;
            else
                this.selectedRecipe = recipe;
        }
        if (this.shouldResetAction)
            this.resetActionState();
    }
}