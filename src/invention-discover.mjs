const { loadModule, getResourceUrl } = mod.getContext(import.meta);

const { InventionPage } = await loadModule('src/invention-page.mjs');

const { InventionDiscoverUIComponent } = await loadModule('src/components/invention-discover.mjs');
class InventionDiscoveryResearchSelectionTab extends ContainedComponent {
    constructor(discovery) {
        super();
        this.discovery = discovery;
        this.recipes = this.discovery.manager.discoveries.allObjects;
        this.recipeContainers = [];
        this.recipeUnlocked = [];
        this.recipeResearched = [];
        this.parent = document.getElementById('invention-discover-research-category-container');
        this.container = createElement('div', {
            classList: ['col-12', 'col-md-4'],
            id: 'invention-discover-research-selection-container'
        });
        this.recipeRow = this.container.appendChild(createElement('div', {
            classList: ['block-content']
        })).appendChild(createElement('div', {
            classList: ['row']
        }));
        this.recipes.forEach(()=>this.addRecipeContainer());
        this.parent.append(this.container);
    }
    updateRecipesForLevel() {
        this.recipes.forEach((recipe,id)=>{
            if (this.isRecipeResearched(recipe)) {
                if (!this.recipeResearched[id])
                    this.setRecipeResearched(id);
            } else if (this.isRecipeUnlocked(recipe)) {
                if (!this.recipeUnlocked[id])
                    this.setRecipeUnlocked(id);
            } else {
                this.setRecipeLocked(id);
            }
        });
    }
    localize() {
        this.recipeResearched.forEach((researched,id)=>{
            if (researched)
                this.setRecipeResearched(id);
        });
        this.recipeUnlocked.forEach((unlocked,id)=>{
            if (unlocked)
                this.setRecipeUnlocked(id);
            else
                this.setRecipeLocked(id);
        });
    }
    isRecipeUnlocked(recipe) {
        return this.discovery.manager.level >= recipe.level;
    }
    isRecipeResearched(recipe) {
        return this.discovery.isRecipeResearched(recipe);
    }
    addRecipeContainer() {
        const container = createElement('div', {
            classList: ['col-12'],
            parent: this.recipeRow,
        }).appendChild(createElement('ul', {
            classList: ['nav', 'nav-pills', 'nav-justified', 'push']
        })).appendChild(createElement('li', {
            classList: ['nav-item', 'mr-1']
        }));
        this.recipeContainers.push(container);
        this.recipeResearched.push(false);
        this.recipeUnlocked.push(false);
    }
    setRecipeResearched(id) {
        const container = this.recipeContainers[id];
        //container.parentElement.parentElement.classList.add('d-none');
        const recipe = this.recipes[id];
        container.textContent = '';
        const span = createElement('h5', {
            classList: ['nav-link', 'justify-content-center', 'font-size-sm', 'nav-main-link', 'border', 'pointer-enabled', 'font-w600', 'text-info'],
        });
        span.onclick = () => {
            this.recipeContainers.forEach(c => {
                c.firstElementChild.classList.remove('township-tab-selected');
            });
            span.classList.add('township-tab-selected');
            this.discovery.selectRecipeOnClick(recipe);
        }
        span.append(document.createTextNode(recipe.name));
        if(this.discovery.currentRecipe === recipe)
            span.classList.add('township-tab-selected');
        this.recipeResearched[id] = true;
        container.append(span);
    }
    setRecipeUnlocked(id) {
        const container = this.recipeContainers[id];
        const recipe = this.recipes[id];
        container.textContent = '';
        const span = createElement('h5', {
            classList: ['nav-main-link', 'justify-content-center', 'font-size-sm', 'border', 'pointer-enabled', 'font-w600'],
        });
        span.onclick = () => {
            this.recipeContainers.forEach(c => {
                c.firstElementChild.classList.remove('township-tab-selected');
            });
            span.classList.add('township-tab-selected');
            this.discovery.selectRecipeOnClick(recipe);
        }
        span.append(document.createTextNode(recipe.name));
        if(this.discovery.currentRecipe === recipe)
            span.classList.add('township-tab-selected');
        this.recipeUnlocked[id] = true;
        container.append(span);
    }
    setRecipeLocked(id) {
        const container = this.recipeContainers[id];
        const recipe = this.recipes[id];
        container.textContent = '';
        const span = createElement('h5', {
            classList: ['nav-main-link', 'justify-content-center', 'font-size-sm', 'border', 'border-danger', 'text-danger'],
        });
        span.append(...getUnlockedAtNodes(this.discovery.manager, recipe.level));
        this.recipeResearched[id] = false;
        this.recipeUnlocked[id] = false;
        container.append(span);
    }
}

class PartIcon extends ContainedComponent {
    constructor(parent) {
        super();
        this.parent = parent;
        this.container = createElement('div', {
            classList: ['bank-item', 'no-bg', 'pointer-enabled', `resize-48`, 'btn-light', 'm-1'],
        });
        this.image = this.container.appendChild(createElement('img', {
            classList: ['bank-img', 'p-2', `resize-48`, 'd-none'],
            parent: this.container,
        }));
        this.selected = false;
        this.faded = false;
        parent.appendChild(this.container);
    }
    setImage(media) {
        this.image.src = media;
    }
    setSelected(selected) {
        this.selected = selected === true;
        this.container.classList.toggle('bg-easy-task', selected === true);
    }
    setFaded(faded) {
        this.faded = faded === true;
        this.container.classList.toggle('opacity-40', faded === true);
    }
    destroy() {
        this.parent.removeChild(this.container);
    }
    hide() {
        this.container.classList.add('d-none');
    }
    show() {
        this.container.classList.remove('d-none');
    }
    setPart(part) {
        this.part = part;

        if(this.part !== undefined) {
            this.setImage(this.part.media);
            this.image.classList.remove('d-none');
        } else {
            this.setImage('');
            this.image.classList.add('d-none');
        }
    }
    setCallback(callback) {
        this.container.onclick = callback;
    }
}

class PuzzleBox extends ContainedComponent {
    constructor(parent) {
        super();
        this.parent = parent;
        this.icons = [];
        this.c = createElement('div', {
            classList: ['col-12', 'pb-2']
        });
        this.container = createElement('div', {
            classList: ['row', 'no-gutters'],
            parent: this.c
        });
        this.leftContainer = createElement('div', {
            classList: ['d-flex', 'flex-wrap', 'align-content-end', 'flex-column', 'justify-content-end', 'col-3'],
            parent: this.container,
        });
        this.centerContainer = createElement('div', {
            classList: ['d-flex', 'flex-wrap', 'align-content-center', 'justify-content-center', 'col-6'],
            parent: this.container,
        });
        this.rightContainer = createElement('div', {
            classList: ['d-flex', 'flex-wrap', 'align-content-start', 'flex-column', 'justify-content-start', 'col-3'],
            parent: this.container,
        });
        this.bottomContainer = createElement('div', {
            classList: ['d-flex', 'flex-wrap', 'align-content-center', 'justify-content-center', 'col-12'],
            parent: this.container,
        });
        this.iconContainer = createElement('div', {
            classList: ['col-12', 'pb-2'],
            parent: this.centerContainer
        });
        this.iconC = createElement('div', {
            classList: ['row', 'no-gutters', 'justify-content-center'],
            parent: this.iconContainer
        });
        this.iconBottomContainer = createElement('div', {
            classList: ['col-12', 'pb-2'],
            parent: this.centerContainer
        });
        this.iconBottomC = createElement('div', {
            classList: ['row', 'no-gutters', 'justify-content-center'],
            parent: this.iconBottomContainer
        });
        
        this.parts = new Set();
        this.parts.add(new PartIcon(this.leftContainer));
        this.parts.add(new PartIcon(this.leftContainer));
        this.parts.add(new PartIcon(this.leftContainer));
        this.parts.add(new PartIcon(this.bottomContainer));
        this.parts.add(new PartIcon(this.bottomContainer));
        this.parts.add(new PartIcon(this.bottomContainer));
        this.parts.add(new PartIcon(this.bottomContainer));
        this.parts.add(new PartIcon(this.rightContainer));
        this.parts.add(new PartIcon(this.rightContainer));
        this.parts.add(new PartIcon(this.rightContainer));

        this.slots = new Set();
        this.slots.add(new PartIcon(this.iconC));
        this.slots.add(new PartIcon(this.iconC));
        this.slots.add(new PartIcon(this.iconC));
        this.slots.add(new PartIcon(this.iconBottomC));
        this.slots.add(new PartIcon(this.iconBottomC));
        parent.append(this.c);
        
        this.size = 48;
    }
}


class InventionDiscoveryPuzzleTab extends ContainedComponent {
    constructor(discovery) {
        super();
        this.discovery = discovery;
        this.parent = document.getElementById('invention-discover-research-category-container');
        this.container = createElement('div', {
            classList: ['col-12', 'col-md-8'],
            id: 'invention-discover-puzzle-container'
        });

        this.puzzleCol = createElement('div', {
            classList: ['block', 'block-rounded-double', 'bg-combat-inner-dark', 'col-12', 'pt-2', 'pb-1', 'text-center']
        });
        this.titleRow = createElement('div', {
            classList: ['row', 'no-gutters', 'justify-content-center'],
            parent: this.puzzleCol
        });
        this.puzzleRow = createElement('div', {
            classList: ['row', 'no-gutters'],
            parent: this.puzzleCol
        });
        this.buttonsRow = createElement('div', {
            classList: ['row', 'no-gutters', 'justify-content-center'],
            parent: this.puzzleCol
        });

        this.title = this.titleRow.appendChild(createElement('div', {
            classList: ['col-12']
        })).appendChild(createElement('h5', {
            classList: ['font-w700', 'text-combat-smoke', 'text-center', 'm-1', 'mb-2']
        })).appendChild(createElement('span'));

        this.inventCounts = this.buttonsRow.appendChild(createElement('div', {
            classList: ['col-12']
        })).appendChild(createElement('span', {
            classList: ['font-w400', 'text-info', 'text-center', 'm-1', 'mb-2']
        })).appendChild(createElement('small'));
        
        this.inventButton = this.buttonsRow.appendChild(createElement('div', {
            classList: ['col-12']
        })).appendChild(createElement('button', {
            classList: ['btn', 'btn-secondary', 'm-1', 'p-2'],
            attributes: [['type', 'button'], ['style', 'height:48px;'], ],
        }));
        this.inventButton.onclick = () => {
            if(!this.discovery.isRecipeResearched(this.selectedRecipe) && this.inventButton.classList.contains('btn-success')) {
                this.discovery.solvePuzzle();
                this.inventButton.blur();
            }
        };

        this.puzzleBox = new PuzzleBox(this.puzzleRow);
        this.puzzleBox.slots.forEach((slot) => {
            slot.setCallback(() => {
                if(!this.locked)
                    this.discovery.selectSlot(slot);
            });
        });
        [...this.puzzleBox.parts].forEach((slot, i) => {
            slot.setPart(this.discovery.parts[i]);
            slot.setCallback(() => {
                if(!this.locked && !slot.faded)
                    this.discovery.selectPart(slot.part)
            });
        });
        this.container.append(this.puzzleCol);

        this.locked = false;

        this.parent.append(this.container);
    }
    lockPuzzle() {
        this.locked = true;
    }
    unlockPuzzle() {
        this.locked = false;
    }
    setInventEnabled(enabled) {
        this.inventButton.classList.toggle('btn-secondary', !enabled);
        this.inventButton.classList.toggle('btn-success', enabled);
    }
    updateTitle(title) {
        this.title.textContent = title;
    }
    updateCounts(correctCount, correctPositionCount, name, baseXP, multiplier) {
        let parts = [...this.puzzleBox.parts];
        let slots = [...this.puzzleBox.slots]
        if(this.discovery.currentPuzzle === undefined || slots.filter(slot => slot.part !== undefined).length < this.discovery.currentPuzzle.length) {
            this.inventCounts.innerHTML = '';
            return;
        }

        parts.forEach(slot => {
            slot.setFaded(correctCount === this.discovery.currentPuzzle.length && !this.discovery.currentPuzzle.includes(slot.part));
        });

        if(this.discovery.isRecipeResearched(this.discovery.currentRecipe)) {
            this.inventCounts.innerHTML = `Solved`;
            return;
        }

        if(correctCount < this.discovery.currentPuzzle.length) {
            this.inventCounts.innerHTML = `Optimization: ${name}</br>${correctCount} correct parts.`;
            return;
        }

        let bonusXP = Math.floor(baseXP * multiplier);

        this.inventCounts.innerHTML = `Optimization: ${name}</br>${correctCount} correct parts, ${correctPositionCount} are in the correct position.</br>You will gain: ${baseXP} + ${bonusXP} XP.`;
        
    }
    localize() {
        this.inventButton.textContent = 'Invent';
    }
}

class InventionDiscoverRenderQueue {
    constructor(){
        this.menu = false;
    }
    updateAll() {
        this.menu = true;
    }
}

export class InventionDiscover extends InventionPage {
    constructor(manager, game) {
        super(manager, game);

        this.component = new InventionDiscoverUIComponent();

        this.renderQueue = new InventionDiscoverRenderQueue();

        this.parts = [
            { id: 'spring', media: getResourceUrl('assets/discover_spring.png') },
            { id: 'gear', media: getResourceUrl('assets/discover_settings.png') },
            { id: 'screw', media: getResourceUrl('assets/discover_screw.png') },
            { id: 'nut', media: getResourceUrl('assets/discover_nut.png') },
            { id: 'wire', media: getResourceUrl('assets/discover_wire.png') },
            { id: 'chain', media: getResourceUrl('assets/discover_chain.png') },
            { id: 'circuit', media: getResourceUrl('assets/discover_electrical-circuit.png') },
            { id: 'lid', media: getResourceUrl('assets/discover_lid.png') },
            { id: 'piston', media: getResourceUrl('assets/discover_piston.png') },
            { id: 'lever', media: getResourceUrl('assets/discover_control-lever.png') },
        ];

        this.optimizations = [
            { name: "Poor", multiplier: 0.2 },
            { name: "Satisfactory", multiplier: 0.4 },
            { name: "Good", multiplier: 0.6 },
            { name: "Very Good", multiplier: 0.7 },
            { name: "Excellent", multiplier: 0.8 },
            { name: "Perfect", multiplier: 1 },
        ]
    }

    hash(str) {
        return [...str].reduce((hash, c) => (((hash << 5) - hash) + c.charCodeAt(0)) | 0, 0);
    }

    selectSlot(slot) {
        this.selectedSlot = slot;
        this.puzzle.puzzleBox.slots.forEach(slot => slot.setSelected(slot === this.selectedSlot));
    }

    selectPart(part) {
        if(this.currentPuzzle === undefined)
            return;
        if(this.selectedSlot !== undefined) {
            let oldSlot = [...this.puzzle.puzzleBox.slots].find(slot => slot.part === part);
            if(oldSlot !== undefined)
                oldSlot.setPart(this.selectedSlot.part);
            this.selectedSlot.setPart(part);

            let correctCount = this.getCorrectCount();
            let correctPositionCount = this.getCorrectPositionCount();
            let { name, multiplier } = this.getOptimization(correctCount, correctPositionCount);
            this.puzzle.updateCounts(correctCount, correctPositionCount, name, this.currentRecipe.baseExperience, multiplier);
            this.puzzle.setInventEnabled(!this.isRecipeResearched(this.selectedRecipe) && correctCount === this.currentPuzzle.length);
        }
    }

    getOptimization(correctCount, correctPositionCount) {
        if(this.currentPuzzle === undefined || correctCount < this.currentPuzzle.length)
            return { name: "Incomplete", multiplier: 0 };
        if(correctCount === this.currentPuzzle.length)
            return this.optimizations[correctPositionCount];
    }

    clearParts() {
        this.puzzle.puzzleBox.slots.forEach(slot => {
            slot.setPart();
        });
        this.puzzle.puzzleBox.parts.forEach(slot => {
            slot.setFaded(false);
        });
        
        this.puzzle.setInventEnabled(false);

        let { name, multiplier } = this.getOptimization(0, 0);
        this.puzzle.updateCounts(0, 0, name, 0, 0);
    }

    getCorrectCount() {
        if(this.currentPuzzle === undefined)
            return 0;
        let puzzleSlots = [...this.puzzle.puzzleBox.slots];
        return this.currentPuzzle.filter((part, i) => puzzleSlots.find(slot => slot.part === part)).length;
    }

    getCorrectPositionCount() {
        if(this.currentPuzzle === undefined)
            return 0;
        let puzzleSlots = [...this.puzzle.puzzleBox.slots];
        return this.currentPuzzle.filter((part, i) => part === puzzleSlots[i].part).length;
    }

    getPuzzleForRecipe(recipe) {
        let seed = this.hash(this.game.characterName + recipe.id);
        let random = () => {
          var x = Math.sin(seed++) * 10000;
          return x - Math.floor(x);
        }

        let array = [...this.parts];

        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array.slice(0, 5);
    }

    solvePuzzle() {
        let correctCount = this.getCorrectCount();
        let correctPositionCount = this.getCorrectPositionCount();

        let { name, multiplier } = this.getOptimization(correctCount, correctPositionCount);
        let baseXP = this.currentRecipe.baseExperience;
        let totalXP = baseXP * Math.floor(1 + multiplier);
        this.manager.addXP(totalXP);

        this.manager.researched.set(this.currentRecipe, true);
        this.puzzle.setInventEnabled(!this.isRecipeResearched(this.currentRecipe));
        
        this.puzzle.updateCounts(correctCount, correctPositionCount, '', 0, 0);

        this.renderQueue.menu = true;
        this.manager.overview.renderQueue.nav = true;
        this.manager.workbench.renderQueue.selectionTabs = true;
    }
    
    isRecipeResearched(recipe) {
        return this.manager.researched.get(recipe) === true;
    }

    onLoad() {
        super.onLoad();
        if(this.seed === 0)
            this.seed = this.hash(game.characterName);
        this.renderQueue.menu = true;
        this.puzzle.localize();
    }

    onLevelUp() {
        this.renderQueue.menu = true;
    }

    onShow() {

    }

    onHide() {
        super.onHide();
    }

    postDataRegistration() {

    }

    initMenus() {
        this.menu = new InventionDiscoveryResearchSelectionTab(this);
        this.puzzle = new InventionDiscoveryPuzzleTab(this);
    }


    selectRecipeOnClick(recipe) {
        if(this.currentRecipe === recipe)
            return;
        this.currentRecipe = recipe;
        this.puzzle.updateTitle(this.currentRecipe.name);
        this.currentPuzzle = this.getPuzzleForRecipe(this.currentRecipe);
        this.selectSlot();
        if(this.isRecipeResearched(this.currentRecipe)) {
            let puzzleSlots = [...this.puzzle.puzzleBox.slots];
            this.currentPuzzle.forEach((part, i) => puzzleSlots[i].setPart(part));
            this.puzzle.updateCounts(5, 5, '', 0, 0);
            this.puzzle.lockPuzzle();
        } else {
            this.clearParts();
            this.puzzle.unlockPuzzle();
        }
    }

    render() {
        super.render();
        this.renderMenu();
    }

    renderMenu() {
        if (!this.renderQueue.menu)
            return;
        this.menu.updateRecipesForLevel();
        this.renderQueue.menu = false;
    }

    encode(writer) {
        writer.writeInt32(this.seed);
        return writer;
    }

    decode(reader, version) {
        this.seed = reader.getInt32();
    }
}