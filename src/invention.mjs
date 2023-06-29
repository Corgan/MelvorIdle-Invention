const { loadModule } = mod.getContext(import.meta);

const { InventionPageUIComponent } = await loadModule('src/components/invention.mjs');

class InventionAugmentedEquipmentItem extends EquipmentItem {
    constructor({id='e' + Math.random().toString(36).slice(-5), item}, manager, game) {
        super(game.registeredNamespaces.getNamespace('invention'), {
            id,
            tier: 'dummyItem',
            name: '',
            category: '',
            type: '',
            media: "assets/media/main/question.svg",
            ignoreCompletion: true,
            obtainFromItemLog: false,
            golbinRaidExclusive: false,
            sellsFor: 0,
            validSlots: [],
            occupiesSlots: [],
            equipRequirements: [],
            equipmentStats: []
        }, game);
        this.manager = manager;
        this.game = game;
        this.item = item;
        this._gizmos = new Set();
        this._xp = 0;
    }
    set tier(_) { }
    get tier() {
        return this.item.tier;
    }
    set name(_) { }
    get name() {
        return "Augmented " + this.item.name;
    }
    set category(_) { }
    get category() {
        return this.item.category;
    }
    set type(_) { }
    get type() {
        return this.item.type;
    }
    set media(_) { }
    get media() {
        return this.item.media;
    }
    set altMedia(_) { }
    get altMedia() {
        return this.item.altMedia;
    }
    set mediaAnimation(_) { }
    get mediaAnimation() {
        return this.item.mediaAnimation;
    }
    set ignoreCompletion(_) { }
    get ignoreCompletion() {
        return true;
    }
    set obtainFromItemLog(_) { }
    get obtainFromItemLog() {
        return false;
    }
    set golbinRaidExclusive(_) { }
    get golbinRaidExclusive() {
        return this.item.golbinRaidExclusive;
    }
    set sellsFor(_) { }
    get sellsFor() {
        return this.item.sellsFor;
    }
    set validSlots(_) { }
    get validSlots() {
        return this.item.validSlots;
    }
    set occupiesSlots(_) { }
    get occupiesSlots() {
        return this.item.occupiesSlots;
    }
    set equipRequirements(_) { }
    get equipRequirements() {
        return this.item.equipRequirements;
    }
    set equipmentStats(_) { }
    get equipmentStats() {
        return this.item.equipmentStats;
    }
    set hasDescription(_) { }
    get hasDescription() {
        return true;
    }
    set description(_) { }
    get description() {
        let tt = `<div class="row no-gutters">
            <div class="col-12">Equipment Level ${this.level}</div>
            <div class="col-12">${this.xp} / ${this.nextXP} XP</div>
            ${[...this._gizmos].map(gizmo => `<div class="col-12">${gizmo.description}</div>`).join('')}
        </div>`;
        if(this.item.hasDescription)
            tt += `${this.item.description}`
        return tt;
    }
    set modifiers(_) { }
    get modifiers() {
        return this.item.modifiers;
    }
    set enemyModifiers(_) { }
    get enemyModifiers() {
        return this.item.enemyModifiers;
    }
    set conditionalModifiers(_) { }
    get conditionalModifiers() {
        return this.item.conditionalModifiers;
    }
    set specialAttacks(_) { }
    get specialAttacks() {
        return this.item.specialAttacks;
    }
    set overrideSpecialChances(_) { }
    get overrideSpecialChances() {
        return this.item.overrideSpecialChances;
    }
    set providedRunes(_) { }
    get providedRunes() {
        return this.item.providedRunes;
    }
    set ammoType(_) { }
    get ammoType() {
        return this.item.ammoType;
    }
    set slots(_) { }
    get slots() {
        return 2;
    }
    set gizmos(_) { }
    get gizmos() {
        return this._gizmos;
    }
    set xp(_) { }
    get xp() {
        return Math.floor(this._xp);
    }
    set nextXP(_) { }
    get nextXP() {
        return game.invention.equipment_xp[Math.min(this.level, game.invention.equipment_xp.length-1)];
    }
    set level(_) { }
    get level() {
        return Math.min(game.invention.maxEquipmentLevel(), game.invention.equipmentXPToLevel(this._xp));
    }


    addXP(xp) {
        this._xp += xp;
        game.combat.player.rendersRequired.equipment = true;
    }

    
    attachGizmo(gizmo) {
        if(gizmo.attachedTo !== undefined)
            return;
        if(this._gizmos.size >= this.slots)
            return;
        this._gizmos.add(gizmo);
        game.bank.removeItemQuantity(gizmo, game.bank.getQty(gizmo));
        console.log("Attached Gizmo ", gizmo.id, " to ", this.id);
    }

    removeGizmo(gizmo) {
        if(!this._gizmos.has(gizmo))
            return;
        this._gizmos.delete(gizmo);
        game.bank.addItem(gizmo, 1, false, false, true, false);
        console.log("Removed Gizmo ", gizmo.id, " from ", this.id);
    }

    encode(writer) {
        writer.writeNamespacedObject(this.item);
        let hasItem = game.bank.hasItem(this);
        writer.writeBoolean(hasItem);
        if(hasItem) {
            let bankItem = game.bank.items.get(this);
            writer.writeUint8(bankItem.tab);
            writer.writeUint16(bankItem.tabPosition);
        }
        let equipmentSet = game.combat.player.equipmentSets.findIndex((set) => set.equipment.slotMap.has(this));
        let isEquipped = equipmentSet !== -1;
        writer.writeBoolean(isEquipped);
        if(isEquipped) {
            writer.writeUint8(equipmentSet);
        }
        writer.writeUint32(this._xp);
        writer.writeSet(this._gizmos, (gizmo, writer) => {
            writer.writeNamespacedObject(gizmo);
        });
    }

    decode(reader) {
        this.item = reader.getNamespacedObject(game.items);
        this.loadedInBank = reader.getBoolean();
        if(this.loadedInBank) {
            this.loadedTab = reader.getUint8();
            this.loadedTabPosition = reader.getUint16();
        }
        this.loadedEquipped = reader.getBoolean();
        if(this.loadedEquipped) {
            this.loadedEquipmentSet = reader.getUint8();
        }
        this._xp = reader.getUint32();
        this._gizmos = reader.getSet((reader) => {
            return reader.getNamespacedObject(game.invention.gizmos);
        });
    }
}

class InventionAugmentedWeaponItem extends WeaponItem {
    constructor({id='w' + Math.random().toString(36).slice(-5), item}, manager, game) {
        super(game.registeredNamespaces.getNamespace('invention'), {
            id,
            tier: 'dummyItem',
            name: '',
            category: '',
            type: '',
            media: "assets/media/main/question.svg",
            ignoreCompletion: true,
            obtainFromItemLog: false,
            golbinRaidExclusive: false,
            sellsFor: 0,
            validSlots: [],
            occupiesSlots: [],
            equipRequirements: [],
            equipmentStats: [],
            attackType: ''
        }, game);
        this.manager = manager;
        this.game = game;
        this.item = item;
        this._gizmos = new Set();
        this._xp = 0;
    }
    set tier(_) { }
    get tier() {
        return this.item.tier;
    }
    set name(_) { }
    get name() {
        return "Augmented " + this.item.name;
    }
    set category(_) { }
    get category() {
        return this.item.category;
    }
    set type(_) { }
    get type() {
        return this.item.type;
    }
    set media(_) { }
    get media() {
        return this.item.media;
    }
    set altMedia(_) { }
    get altMedia() {
        return this.item.altMedia;
    }
    set mediaAnimation(_) { }
    get mediaAnimation() {
        return this.item.mediaAnimation;
    }
    set ignoreCompletion(_) { }
    get ignoreCompletion() {
        return true;
    }
    set obtainFromItemLog(_) { }
    get obtainFromItemLog() {
        return false;
    }
    set golbinRaidExclusive(_) { }
    get golbinRaidExclusive() {
        return this.item.golbinRaidExclusive;
    }
    set sellsFor(_) { }
    get sellsFor() {
        return this.item.sellsFor;
    }
    set validSlots(_) { }
    get validSlots() {
        return this.item.validSlots;
    }
    set occupiesSlots(_) { }
    get occupiesSlots() {
        return this.item.occupiesSlots;
    }
    set equipRequirements(_) { }
    get equipRequirements() {
        return this.item.equipRequirements;
    }
    set equipmentStats(_) { }
    get equipmentStats() {
        return this.item.equipmentStats;
    }
    set attackType(_) { }
    get attackType() {
        return this.item.attackType;
    }
    set ammoTypeRequired(_) { }
    get ammoTypeRequired() {
        return this.item.ammoTypeRequired;
    }
    set hasDescription(_) { }
    get hasDescription() {
        return true;
    }
    set description(_) { }
    get description() {
        let gizmos = [...this._gizmos];
        let gizmoString = '';
        for(let i=0; i<2; i++) {
            if(gizmos[i] !== undefined) {
                gizmoString += `<div class="col-12">${gizmos[i].description}</div>`
            } else {
                gizmoString += `<div class="col-12">Empty Slot</div>`
            }
        }
        let tt = `<div class="row no-gutters">
            <div class="col-12">Equipment Level ${this.level}</div>
            <div class="col-12">${this.xp} / ${this.nextXP} XP</div>
            ${gizmoString}
        </div>`;
        if(this.item.hasDescription)
            tt += `${this.item.description}`
        return tt;
    }
    set modifiers(_) { }
    get modifiers() {
        return this.item.modifiers;
    }
    set enemyModifiers(_) { }
    get enemyModifiers() {
        return this.item.enemyModifiers;
    }
    set conditionalModifiers(_) { }
    get conditionalModifiers() {
        return this.item.conditionalModifiers;
    }
    set specialAttacks(_) { }
    get specialAttacks() {
        return this.item.specialAttacks;
    }
    set overrideSpecialChances(_) { }
    get overrideSpecialChances() {
        return this.item.overrideSpecialChances;
    }
    set providedRunes(_) { }
    get providedRunes() {
        return this.item.providedRunes;
    }
    set ammoType(_) { }
    get ammoType() {
        return this.item.ammoType;
    }
    set slots(_) { }
    get slots() {
        return this.item.occupiesSlots.includes('Shield') ? 2 : 1;
    }
    set gizmos(_) { }
    get gizmos() {
        return this._gizmos;
    }
    set xp(_) { }
    get xp() {
        return Math.floor(this._xp);
    }
    set nextXP(_) { }
    get nextXP() {
        return game.invention.equipment_xp[Math.min(this.level, game.invention.equipment_xp.length-1)];
    }
    set level(_) { }
    get level() {
        return Math.min(game.invention.maxEquipmentLevel(), game.invention.equipmentXPToLevel(this._xp));
    }

    addXP(xp) {
        this._xp += xp;
        game.combat.player.rendersRequired.equipment = true;
    }

    attachGizmo(gizmo) {
        if(gizmo.attachedTo !== undefined)
            return;
        if(this._gizmos.size >= this.slots)
            return;
        this._gizmos.add(gizmo);
        game.bank.removeItemQuantity(gizmo, game.bank.getQty(gizmo));
        console.log("Attached Gizmo ", gizmo.id, " to ", this.id);
    }

    removeGizmo(gizmo) {
        if(!this._gizmos.has(gizmo))
            return;
        this._gizmos.delete(gizmo);
        game.bank.addItem(gizmo, 1, false, false, true, false);
        console.log("Removed Gizmo ", gizmo.id, " from ", this.id);
    }

    encode(writer) {
        writer.writeNamespacedObject(this.item);
        let hasItem = game.bank.hasItem(this);
        writer.writeBoolean(hasItem);
        if(hasItem) {
            let bankItem = game.bank.items.get(this);
            writer.writeUint8(bankItem.tab);
            writer.writeUint16(bankItem.tabPosition);
        }
        let equipmentSet = game.combat.player.equipmentSets.findIndex((set) => set.equipment.slotMap.has(this));
        let isEquipped = equipmentSet !== -1;
        writer.writeBoolean(isEquipped);
        if(isEquipped) {
            writer.writeUint8(equipmentSet);
        }
        writer.writeFloat32(this._xp);
        writer.writeSet(this._gizmos, (gizmo, writer) => {
            writer.writeNamespacedObject(gizmo);
        });
    }

    decode(reader) {
        this.item = reader.getNamespacedObject(game.items);
        this.loadedInBank = reader.getBoolean();
        if(this.loadedInBank) {
            this.loadedTab = reader.getUint8();
            this.loadedTabPosition = reader.getUint16();
        }
        this.loadedEquipped = reader.getBoolean();
        if(this.loadedEquipped) {
            this.loadedEquipmentSet = reader.getUint8();
        }
        this._xp = reader.getFloat32();
        this._gizmos = reader.getSet((reader) => {
            return reader.getNamespacedObject(game.invention.gizmos);
        });
    }
}

class InventionGizmo extends Item {
    constructor({id='g' + Math.random().toString(36).slice(-5), item}, manager, game) {
        super(game.registeredNamespaces.getNamespace('invention'), {
            id,
            tier: 'dummyItem',
            name: '',
            category: '',
            type: '',
            media: "assets/media/main/question.svg",
            ignoreCompletion: true,
            obtainFromItemLog: false,
            golbinRaidExclusive: false,
            sellsFor: 0
        }, game);
        this.manager = manager;
        this.game = game;
        this.item = item;
        this._perks = new Map();
    }

    set description(_) { }
    get description() {
        return `<div class="row no-gutters">
            ${[...this.perks.entries()].map(([perk, rank]) => {
                const equipStats = perk.equipmentStats;
                let stats = equipStats.map((stat)=>{
                    if (stat.value > 0) {
                        return `<span class="text-success">${Equipment.getEquipStatDescription(stat.key, stat.value * rank)}</span>`;
                    } else {
                        return `<span class="text-danger">${Equipment.getEquipStatDescription(stat.key, stat.value * rank)}</span>`;
                    }
                });

                let mods = getModifierDataSpans(perk.modifiers, rank, rank);

                let desc = [...stats, ...mods];

                return `<div class="col-12">${perk.name} Rank ${rank}</br>${desc.join('</br>')}</div>`
            }).join('')}
        </div>`;
    }

    set hasDescription(_) { }
    get hasDescription() {
        return true;
    }
    set tier(_) { }
    get tier() {
        return this.item.tier;
    }
    set name(_) { }
    get name() {
        return this.item.name;
    }
    set category(_) { }
    get category() {
        return this.item.category;
    }
    set type(_) { }
    get type() {
        return this.item.type;
    }
    set media(_) { }
    get media() {
        return this.item.media;
    }
    set altMedia(_) { }
    get altMedia() {
        return this.item.altMedia;
    }
    set mediaAnimation(_) { }
    get mediaAnimation() {
        return this.item.mediaAnimation;
    }
    set ignoreCompletion(_) { }
    get ignoreCompletion() {
        return true;
    }
    set obtainFromItemLog(_) { }
    get obtainFromItemLog() {
        return false;
    }
    set golbinRaidExclusive(_) { }
    get golbinRaidExclusive() {
        return this.item.golbinRaidExclusive;
    }
    set sellsFor(_) { }
    get sellsFor() {
        return this.item.sellsFor;
    }

    set perks(_) { }
    get perks() {
        return this._perks;
    }

    set attachedTo(_) { }
    get attachedTo() {
        let augmentedItems = [...game.invention.augmentedEquipment.allObjects, ...game.invention.augmentedWeapons.allObjects];
        return augmentedItems.find((item => item.gizmos.has(this)));
    }

    setPerks(perks) {
        this._perks.clear();
        perks.forEach((value, key) => {
            this._perks.set(key, value);
        });
    }

    encode(writer) {
        writer.writeNamespacedObject(this.item);
        let hasItem = game.bank.hasItem(this);
        writer.writeBoolean(hasItem);
        if(hasItem) {
            let bankItem = game.bank.items.get(this);
            writer.writeUint8(bankItem.tab);
            writer.writeUint16(bankItem.tabPosition);
        }
        writer.writeComplexMap(this._perks, (key, value, writer) => {
            writer.writeNamespacedObject(key);
            writer.writeUint8(value);
        });
    }

    decode(reader) {
        this.item = reader.getNamespacedObject(game.items);
        this.loadedInBank = reader.getBoolean();
        if(this.loadedInBank) {
            this.loadedTab = reader.getUint8();
            this.loadedTabPosition = reader.getUint16();
        }
        this._perks = reader.getComplexMap((reader) => {
            let key = reader.getNamespacedObject(game.invention.perks);
            let value = reader.getUint8();
            return {key, value};
        });
    }
}

class InventionWorkbenchRecipe extends NamespacedObject {
    constructor(namespace, data, manager, game) {
        super(namespace, data.id);
        this.manager = manager;
        this.game = game;
        this._name = data.name;
        this._media = data.media;
        this.level = data.level;
        this.baseExperience = data.baseExperience;
        this.baseQuantity = data.baseQuantity;
        this.itemCosts = game.items.getQuantities(data.itemCosts);
        this.product = game.items.getObjectByID(data.productID);
    }
    get name() {
        return this.product.name;
    }
    get media() {
        return this.product.media;
    }
    get description() {
        return this._description;
    }
}

class InventionPerk extends NamespacedObject {
    constructor(namespace, data, manager, game) {
        super(namespace, data.id);
        this.manager = manager;
        this.game = game;
        this._name = data.name;
        this._media = data.media;
        this.modifiers = game.getPlayerModifiersFromData(data.modifiers);
        this.equipmentStats = data.equipmentStats;
        this.ranks = data.ranks;
    }
    get name() {
        return this._name;
    }
    get media() {
        return this.getMediaURL(this._media);
    }
}

class InventionComponent extends NamespacedObject {
    constructor(namespace, data, manager, game) {
        super(namespace, data.id);
        this.manager = manager;
        this.game = game;
        this.perks = data.perks;
    }
}

class MaterialsDropTable extends DropTable {
    constructor(game, data, count=5, junkChance=35, requires=1) {
        super(game, data);
        this.count = count;
        this.requires = requires;
        this.junkChance = junkChance;
    }

    getChances() {
        return [...this.drops].map(({item, weight}) => ({ item, chance: Math.floor((weight / this.weight) * 100) }))
    }
}

class InventionRenderQueue extends SkillRenderQueue {
    constructor() {
        super(...arguments);
    }
}

const { InventionOverview } = await loadModule('src/invention-overview.mjs');
const { InventionPages } = await loadModule('src/invention-pages.mjs');

const { InventionWorkbench } = await loadModule('src/invention-workbench.mjs');
const { InventionDisassemble } = await loadModule('src/invention-disassemble.mjs');
const { InventionAugmentation } = await loadModule('src/invention-augmentation.mjs');
const { InventionGizmoTable } = await loadModule('src/invention-gizmo-table.mjs');

export class Invention extends Skill {
    constructor(namespace, game) {
        super(namespace, 'Invention', game);
        this.version = 1;
        this.saveVersion = -1;
        this._media = 'melvor:assets/media/main/adventure.svg';
        this.renderQueue = new InventionRenderQueue();
        this.isActive = false;

        this.augmentedEquipment = new NamespaceRegistry(this.game.registeredNamespaces);
        this.augmentedWeapons = new NamespaceRegistry(this.game.registeredNamespaces);

        this.gizmos = new NamespaceRegistry(this.game.registeredNamespaces);

        this.perks = new NamespaceRegistry(this.game.registeredNamespaces);

        this.components = new NamespaceRegistry(this.game.registeredNamespaces);

        this.component = new InventionPageUIComponent();

        this.overview = new InventionOverview(this, this.game);
        this.overview.component.mount(this.component.overview);

        this.pages = new InventionPages(this, this.game);

        this.workbench = new InventionWorkbench(this, this.game);
        this.disassemble = new InventionDisassemble(this, this.game);
        this.augmentation = new InventionAugmentation(this, this.game);
        this.gizmo_table = new InventionGizmoTable(this, this.game);

        this.pages.register('workbench', this.workbench);
        this.pages.register('disassemble', this.disassemble);
        this.pages.register('augmentation', this.augmentation);
        this.pages.register('gizmo_table', this.gizmo_table);

        this.equipment_xp = [
            0,
            1160,
            2607,
            5176,
            8286,
            11760,
            15835,
            21152,
            28761,
            40120,
            57095,
            81960,
            117397,
            166496,
            232755,
            320080,
            432785,
            575592,
            753631,
            972440
        ];

        this.equipment_reward = [
            0,
            9000,
            27000,
            54000,
            108000,
            144000,
            198000,
            270000,
            378000,
            540000
        ];

        this.cachedDropTables = new Map();

        console.log("Invention constructor done");
    }

    maxEquipmentLevel() {
        if(this.level >= 99)
            return 20;
        if(this.level >= 60)
            return 15;
        if(this.level >= 27)
            return 10;
        if(this.level >= 4)
            return 5;
        return 1;
    }

    equipmentXPToLevel(xp) {
        for(let i = 0; i < this.equipment_xp.length; i++) {
            if(xp <= this.equipment_xp[i])
                return Math.max(1, i);
        }
        return this.equipment_xp.length;
    }

    equipmentXPReward(level) {
        if(level < 1)
            level = 1;
        let reward = this.equipment_reward[Math.min(level-1, this.equipment_reward.length-1)];
        return reward;
    }

    addTestData() {
        this.game.bank.addItem(game.items.getObjectByID('melvorD:Strawberry_Cupcake_Perfect'), 1e6, false, false, true, false);
        this.game.bank.addItem(game.items.getObjectByID('melvorF:Ragnar_God_Helmet'), 1, false, false, true, false);
        this.game.bank.addItem(game.items.getObjectByID('melvorF:Ragnar_God_Boots'), 1, false, false, true, false);
        this.game.bank.addItem(game.items.getObjectByID('melvorF:Ragnar_God_Gloves'), 1, false, false, true, false);
        this.game.bank.addItem(game.items.getObjectByID('melvorF:Fighter_Ring'), 1, false, false, true, false);
        this.game.bank.addItem(game.items.getObjectByID('melvorF:Fighter_Amulet'), 1, false, false, true, false);
        this.game.bank.addItem(game.items.getObjectByID('melvorF:Infernal_Cape'), 1, false, false, true, false);
        let ron1 = this.createAugmentedItem(game.items.getObjectByID('melvorF:Ultima_Godsword'));
        let rag1 = this.createAugmentedItem(game.items.getObjectByID('melvorF:Ragnar_God_Platebody'));
        let rag2 = this.createAugmentedItem(game.items.getObjectByID('melvorF:Ragnar_God_Platelegs'));
        let wgizmo1 = this.createWeaponGizmo();
        let wgizmo2 = this.createWeaponGizmo();
        let egizmo1 = this.createEquipmentGizmo();
        let egizmo2 = this.createEquipmentGizmo();
        let egizmo3 = this.createEquipmentGizmo();
        let egizmo4 = this.createEquipmentGizmo();

        ron1.attachGizmo(wgizmo1);
        ron1.attachGizmo(wgizmo2);
        rag1.attachGizmo(egizmo1);
        rag1.attachGizmo(egizmo2);
        rag2.attachGizmo(egizmo3);
        rag2.attachGizmo(egizmo4);
    }

    createAugmentedWeapon(item) {
        if(!(item instanceof WeaponItem))
            return;
        let augmentedItem = new InventionAugmentedWeaponItem({item}, this, this.game);
        this.augmentedWeapons.registerObject(augmentedItem);
        this.game.items.registerObject(augmentedItem);
        //this.game.bank.addItem(augmentedItem, 1, false, false, true, false);
        console.log("Created Augmented Weapon:", augmentedItem.id, augmentedItem.name);
        return augmentedItem;
    }

    createAugmentedEquipment(item) {
        if(!(item instanceof EquipmentItem) || item instanceof WeaponItem)
            return;
        if(!item.validSlots.includes('Platebody') && !item.validSlots.includes('Platelegs'))
            return;
        let augmentedItem = new InventionAugmentedEquipmentItem({item}, this, this.game);
        this.augmentedEquipment.registerObject(augmentedItem);
        this.game.items.registerObject(augmentedItem);
        //this.game.bank.addItem(augmentedItem, 1, false, false, true, false);
        console.log("Created Augmented Equipment:", augmentedItem.id, augmentedItem.name);
        return augmentedItem;
    }

    createAugmentedItem(item) {
        if(!(item instanceof EquipmentItem))
            return;
        if(item instanceof WeaponItem) {
            return this.createAugmentedWeapon(item);
        } else if (item instanceof EquipmentItem) {
            return this.createAugmentedEquipment(item);
        }
    }

    isAugmentedItem(item) {
        return item instanceof InventionAugmentedEquipmentItem || item instanceof InventionAugmentedWeaponItem;
    }

    removeAugmentedItem(item) {
        if(!(item instanceof InventionAugmentedEquipmentItem || item instanceof InventionAugmentedWeaponItem))
            return;
        console.log("Removed Augmented Item:", item.id, item.name);
        if(item instanceof InventionAugmentedWeaponItem) {
            this.augmentedWeapons.registeredObjects.delete(item.id);
        } else if (item instanceof InventionAugmentedEquipmentItem) {
            this.augmentedEquipment.registeredObjects.delete(item.id);
        }
        item.gizmos.forEach(gizmo => {
            this.removeGizmo(gizmo);
        });
    }

    showGizmoModal(item) {
        $('#modal-invention-gizmos').modal('show');
    }

    isGizmo(item) {
        return item instanceof InventionGizmo;
    }

    removeGizmo(item) {
        if(!(item instanceof InventionGizmo))
            return;
        if(item instanceof InventionGizmo) {
            console.log("Removed Gizmo:", item.id, item.description);
            this.gizmos.registeredObjects.delete(item.id);
        }
    }

    createWeaponGizmo() {
        let item = game.items.registeredObjects.get('invention:Weapon_Gizmo');
        let gizmo = new InventionGizmo({item}, this, this.game);

        let perks = new Map();
        let possiblePerks = [...this.perks.allObjects].sort(() => 0.5 - Math.random());
        for(let i=0; i<2; i++) {
            let perk = possiblePerks[i];
            let value = Math.floor(Math.random() * 6) + 1;
            perks.set(perk, value);
        }
        gizmo.setPerks(perks);

        this.gizmos.registerObject(gizmo);
        this.game.items.registerObject(gizmo);
        this.game.bank.addItem(gizmo, 1, false, false, true, false);
        console.log("Created Weapon Gizmo:", gizmo.id, gizmo.description);
        return gizmo;
    }

    createEquipmentGizmo() {
        let item = game.items.registeredObjects.get('invention:Equipment_Gizmo');
        let gizmo = new InventionGizmo({item}, this, this.game);

        let perks = new Map();
        let possiblePerks = [...this.perks.allObjects].sort(() => 0.5 - Math.random());
        for(let i=0; i<2; i++) {
            let perk = possiblePerks[i];
            let value = Math.floor(Math.random() * 6) + 1;
            perks.set(perk, value);
        }
        gizmo.setPerks(perks);

        this.gizmos.registerObject(gizmo);
        this.game.items.registerObject(gizmo);
        this.game.bank.addItem(gizmo, 1, false, false, true, false);
        console.log("Created Equipment Gizmo:", gizmo.id, gizmo.description);
        return gizmo;
    }

    rewardForDamage(damage) {
        damage = damage / numberMultiplier;
        let items = [...game.combat.player.equipment.slotMap.keys()];
        items.forEach(item => {
            if(item instanceof InventionAugmentedWeaponItem) {
                if(item.occupiesSlots.includes('Shield')) {
                    item.addXP(damage * 0.06);
                } else if (item.validSlots.includes('Shield')) {
                    item.addXP(damage * 0.02);
                } else {
                    item.addXP(damage * 0.04);
                }
            } else if (item instanceof InventionAugmentedEquipmentItem) {
                item.addXP(damage * 0.04);
            }
        });
    }

    canDisassemble(item) {
        if(this.isAugmentedItem(item))
            item = item.item;
        return item.canDisassemble;
    }

    getJunkChanceForItem(item) {
        if(this.isAugmentedItem(item))
            item = item.item;
        if(this.cachedDropTables.has(item.id)) {
            let table = this.cachedDropTables.get(item.id);
            return table.junkChance;
        }
        return 35;
    }

    getDropTableForItem(item) {
        if(this.isAugmentedItem(item))
            item = item.item;
        if(this.cachedDropTables.has(item.id))
            return this.cachedDropTables.get(item.id);
        
        let table = new MaterialsDropTable(game, [
            { itemID: 'invention:Simple_Parts', weight: 100, minQuantity: 1, maxQuantity: 1}
        ]);
        this.cachedDropTables.set(item.id, table);
        return table;
    }

    getMaterialCountForItem(item) {
        if(this.isAugmentedItem(item))
            item = item.item;
        if(this.cachedDropTables.has(item.id)) {
            let table = this.cachedDropTables.get(item.id);
            return table.count;
        }
        return 5;
    }

    getRequiredCountForItem(item) {
        if(this.isAugmentedItem(item))
            item = item.item;
        if(this.cachedDropTables.has(item.id)) {
            let table = this.cachedDropTables.get(item.id);
            return table.requires !== undefined ? table.requires : 1;
        }
        return 1;
    }

    generatePerks() {
        let budget = 0;
        for(let i = 0; i < 5; i++)
            budget += rollInteger(0, Math.floor(this.level / 2) + 20);
        budget = Math.max(budget, this.level);

        let materials = [
            "invention:Simple_Parts", // Center
            "invention:Simple_Parts", // 
            "invention:Base_Parts", //
            "invention:Base_Parts", //
            "invention:Base_Parts", //
        ]

        let perks = new Map();
        let type = "weapon";
        materials.forEach(material => {
            let component = this.components.getObjectByID(material);
            component.perks[type].forEach(perkValue => {
                let perk = this.perks.getObjectByID(perkValue.perkID);
                let current = perks.get(perk) || 0;
                let value = current + perkValue.base + rollInteger(0, perkValue.roll);
                perks.set(perk, value);
            });
        });
        let ranks = [...perks.entries()].map(([perk, value]) => {
            if(value < perk.ranks[0].threshold)
                return { perk, value, cost: 0, rank: 0 };
            let rank = perk.ranks[0];
            for(let i = 1; i < perk.ranks.length; i++) {
                if(value < perk.ranks[i].threshold) {
                    break;
                } else {
                    rank = perk.ranks[i];
                }
            }
            return { perk, value, cost: rank.cost, rank: rank.rank, threshold: rank.threshold };
        })
        this.perksort(0, ranks.length-1, ranks, (a, b) => a.cost - b.cost);
        let chosen = [];
        for(let i = ranks.length-1; i >= 0; i--) {
            if(ranks[i].cost <= budget && ranks[i].rank > 0) {
                chosen.push({ perk: ranks[i].perk, rank: ranks[i].rank });
                budget -= ranks[i].cost;
                if(chosen.length === 2)
                    break;
            }
        }
        return chosen;
    }

    perksort(low, high, arr, compare) {
        var pivot_index = (~~((low + high)/2));
        var pivot_value = arr[pivot_index];
        arr[pivot_index] = arr[high];
        arr[high] = pivot_value;
        var counter = low;
        var loop_index = low;
    
        while (loop_index < high) {
            if (compare(arr[loop_index], pivot_value) < (loop_index & 1)) {
                var tmp = arr[loop_index];
                arr[loop_index] = arr[counter];
                arr[counter] = tmp;
                counter = counter + 1;
            }
            loop_index = loop_index + 1;
        }
        
        arr[high] = arr[counter];
        arr[counter] = pivot_value;
    
        if (low < (counter - 1)) {
            this.perksort(low, counter - 1, arr, compare);
        }
        if ((counter + 1) < high) {
            this.perksort(counter + 1, high, arr, compare);
        }
    }
    
    /*
        - Charge Pack (Astro Dust)
            - Divine Charges
        - Work Bench
            - Craft Items (Gizmo Shells)
        - Disassemble
            - Queue x Items
        - Augment
            * Create
            * Level
            - Siphon
        - Gizmos
            - Fill with Materials
            - Generate Perks
            * Attach
    */

    onLoad() {
        console.log("Invention onLoad");
        super.onLoad();

        this.overview.onLoad();
        this.pages.onLoad();

        let bankItems = [...this.augmentedEquipment.allObjects, ...this.augmentedWeapons.allObjects, ...this.gizmos.allObjects];

        let bankAugmentedItems = bankItems.filter(augmentedItem => augmentedItem.loadedInBank === true).sort((a,b) => {
            if(a.loadedTab === b.loadedTab)
                return a.loadedTabPosition - b.loadedTabPosition;
            return a.loadedTab - b.loadedTab;
        });

        bankAugmentedItems.forEach((augmentedItem) => {
            if(augmentedItem.loadedInBank) {
                game.bank.addItem(augmentedItem, 1, false, false, true, false);

                let bankItem = game.bank.items.get(augmentedItem);
                
                game.bank.moveItemToNewTab(bankItem.tab, augmentedItem.loadedTab, bankItem.tabPosition);
                game.bank.moveItemInTab(bankItem.tab, bankItem.tabPosition, augmentedItem.loadedTabPosition);

                console.log(bankItem.item.id, augmentedItem.loadedTab, augmentedItem.loadedTabPosition, bankItem.tab, bankItem.tabPosition);
            }
        });

        let equippedAugmentedItems = [...this.augmentedEquipment.allObjects, ...this.augmentedWeapons.allObjects].filter(augmentedItem => augmentedItem.loadedEquipped === true);

        equippedAugmentedItems.forEach((augmentedItem) => {
            if(augmentedItem.loadedEquipped) {
                game.combat.player.equipmentSets[augmentedItem.loadedEquipmentSet].equipment.equipItem(augmentedItem, augmentedItem.validSlots[0], 1);
                console.log(augmentedItem.id, augmentedItem.loadedEquipmentSet);
            }
        });
        
        this.workbench.go();
    }

    onLevelUp(oldLevel, newLevel) {
        super.onLevelUp(oldLevel, newLevel);

        this.pages.onLevelUp();
    }

    get name() { return "Invention"; }
    get isCombat() { return false; }
    get hasMinibar() { return true; }

    get activeSkills() {
        if (!this.isActive)
            return [];
        else
            return [this];
    }

    get canStop() {
        return this.isActive && !this.game.isGolbinRaid;
    }

    get canStart() {
        return !this.game.idleChecker(this);
    }

    start() {
        if (!this.canStart)
            return false;
        
        this.isActive = true;
        this.game.renderQueue.activeSkills = true;
        this.game.activeAction = this;

        saveData();
        return true;
    }

    stop() {
        if(!this.canStop)
            return false;
            
        this.isActive = false;
        this.game.renderQueue.activeSkills = true;
        this.game.clearActiveAction(false);

        saveData();
        return true;
    }

    getErrorLog() {
        return `Is Active: ${this.isActive}\n`;
    }

    activeTick() {
        this.pages.activeTick();
    }

    passiveTick() {
        if(this.isActive)
            return;
    }

    queueBankQuantityRender(item) {
        this.pages.queueBankQuantityRender(item);
    }

    onPageChange() {
        this.pages.onPageChange();
    }

    render() {
        super.render();
        this.overview.render();
        this.pages.render();
    }

    registerData(namespace, data) {
        console.log("Invention registerData");
        super.registerData(namespace, data); // pets, rareDrops, minibar, customMilestones

        this.overview.registerData(data.overview, this, this.game);

        data.perks.forEach(data => {
            let perk = new InventionPerk(namespace, data, this, this.game);
            this.perks.registerObject(perk);
        });

        data.workbench.forEach(data => {
            let action = new InventionWorkbenchRecipe(namespace, data, this, this.game);
            this.workbench.actions.registerObject(action);
        });

        data.components.forEach(data => {
            let component = new InventionComponent(namespace, data, this, this.game);
            this.components.registerObject(component);
        });

        data.disassemble_categories.forEach(data => {
            if(data.items !== undefined) {
                data.items.forEach(item => {
                    let table = new MaterialsDropTable(game, data.parts, item.count !== undefined ? item.count : data.count, item.junkChance !== undefined ? item.junkChance : data.junkChance, item.requires !== undefined ? item.requires : data.requires);
                    this.cachedDropTables.set(item.id, table);
                });
            }
        });
    }

    postDataRegistration() {
        console.log("Invention postDataRegistration");
        super.postDataRegistration(); // Milestones setLevel

        [...this.cachedDropTables.keys()].forEach(id => {
            game.items.getObjectByID(id).canDisassemble = true;
        });
    }

    encode(writer) {
        let start = writer.byteOffset;
        super.encode(writer); // Encode default skill data
        writer.writeUint32(this.version); // Store current skill version
        writer.writeBoolean(this.isActive);

        let gizmos = [...this.gizmos.allObjects];
        
        writer.writeArray(gizmos, (value, writer) => {
            writer.writeString(value.localID);
            value.encode(writer);
        });

        let augmentedItems = [...this.augmentedWeapons.allObjects, ...this.augmentedEquipment.allObjects];
        
        writer.writeArray(augmentedItems, (value, writer) => {
            writer.writeString(value.localID);
            value.encode(writer);
        });

        this.pages.encode(writer);
        
        let end = writer.byteOffset;
        console.log(`Wrote ${end-start} bytes for Invention save`);
        return writer;
    }

    decode(reader, version) {
        console.log("Invention save decoding");
        let start = reader.byteOffset;
        reader.byteOffset -= Uint32Array.BYTES_PER_ELEMENT; // Let's back up a minute and get the size of our skill data
        let skillDataSize = reader.getUint32();

        try {
            super.decode(reader, version);
            this.saveVersion = reader.getUint32(); // Read save version
            if(this.saveVersion < this.version)
                throw new Error("Old Save Version");
            this.isActive = reader.getBoolean();

            reader.getArray((reader) => {
                let key = reader.getString();
                let value = new InventionGizmo({id: key}, this, this.game);
                value.decode(reader);
                this.gizmos.registerObject(value);
                this.game.items.registerObject(value);
                return { key, value };
            });

            reader.getArray((reader) => {
                let key = reader.getString();
                let isWeapon = key[0] === "w";
                let value = isWeapon ? new InventionAugmentedWeaponItem({id: key}, this, this.game) : new InventionAugmentedEquipmentItem({id: key}, this, this.game);
                value.decode(reader);
                if(isWeapon) {
                    this.augmentedWeapons.registerObject(value);
                } else {
                    this.augmentedEquipment.registerObject(value);
                }
                this.game.items.registerObject(value);
                return { key, value };
            });

            this.pages.decode(reader, version);
        } catch(e) { // Something's fucky, dump all progress and skip past the trash save data
            console.log(e);
            reader.byteOffset = start;
            reader.getFixedLengthBuffer(skillDataSize);
        }

        let end = reader.byteOffset;
        console.log(`Read ${end-start} bytes for Invention save`);
    }
}

