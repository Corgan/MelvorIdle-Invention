const { loadModule } = mod.getContext(import.meta);


const { InventionPageUIComponent } = await loadModule('src/components/invention.mjs');

class InventionAugmentedEquipmentItem extends EquipmentItem {
    constructor({id='e' + Math.random().toString(36).slice(-5), item}) {
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
        this.item = item;
        this._gizmos = new Set();
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
        return this.item.hasDescription;
    }
    set description(_) { }
    get description() {
        return this.item.description;
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
    }
}

class InventionAugmentedWeaponItem extends WeaponItem {
    constructor({id='w' + Math.random().toString(36).slice(-5), item}) {
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
        this.item = item;
        this._gizmos = new Set();
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
        return this.item.hasDescription;
    }
    set description(_) { }
    get description() {
        let description = this.item.description;
        if(this._gizmos.size > 0)
            description += '</br>' + [...this._gizmos].map(gizmo => gizmo.description).join('</br>');
        return description;
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

    attachGizmo(gizmo) {
        this._gizmos.add(gizmo);
    }

    removeGizmo(gizmo) {
        this._gizmos.delete(gizmo);
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
        this._gizmos = reader.getSet((reader) => {
            return reader.getNamespacedObject(game.invention.gizmos);
        });
    }
}

class InventionGizmo extends Item {
    constructor({id='g' + Math.random().toString(36).slice(-5), item}) {
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
        this.item = item;
        this._perks = new Map();
    }

    set description(_) { }
    get description() {
        return [...this.perks.entries()].map(([perk, rank]) => perk.name + ' ' + rank).join('</br>');
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

class InventionPerk extends NamespacedObject {
    constructor(namespace, data, game) {
        super(namespace, data.id);
        this._name = data.name;
        this._media = data.media;
        this.modifiers = game.getPlayerModifiersFromData(data.modifiers);
        this.equipmentStats = data.equipmentStats;
    }
    get name() {
        return this._name;
    }
    get media() {
        return this.getMediaURL(this._media);
    }
}

class InventionRenderQueue extends SkillRenderQueue {
    constructor() {
        super(...arguments);
    }
}

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

        this.component = new InventionPageUIComponent(this, this.game);

        console.log("Invention constructor done");
    }

    createAugmentedWeapon(item) {
        if(!(item instanceof WeaponItem))
            return;
        let augmentedItem = new InventionAugmentedWeaponItem({item});
        this.augmentedWeapons.registerObject(augmentedItem);
        this.game.items.registerObject(augmentedItem);
        this.game.bank.addItem(augmentedItem, 1, false, false, true, false);
        return augmentedItem;
    }

    createAugmentedEquipment(item) {
        if(!(item instanceof EquipmentItem) || item instanceof WeaponItem)
            return;
        let augmentedItem = new InventionAugmentedEquipmentItem({item});
        this.augmentedEquipment.registerObject(augmentedItem);
        this.game.items.registerObject(augmentedItem);
        this.game.bank.addItem(augmentedItem, 1, false, false, true, false);
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
        if(item instanceof InventionAugmentedWeaponItem) {
            this.augmentedWeapons.registeredObjects.delete(item.id);
        } else if (item instanceof InventionAugmentedEquipmentItem) {
            this.augmentedEquipment.registeredObjects.delete(item.id);
        }
    }

    createWeaponGizmo() {
        let item = game.items.registeredObjects.get('invention:Weapon_Gizmo');
        let gizmo = new InventionGizmo({item});

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
        return gizmo;
    }

    createEquipmentGizmo() {
        let item = game.items.registeredObjects.get('invention:Equipment_Gizmo');
        let gizmo = new InventionGizmo({item});

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
        return gizmo;
    }
    
    /*
        - Charge Pack (Astro Dust)
            - Divine Charges
        - Disassemble
            - Materials Inventory
        - Augment
            - Create
            - Level
            - Siphon
            - Armory
                - Dummy Equipment Items
        - Gizmos
            - Craft
            - Fill Perks
            - Attach
    */

    onLoad() {
        console.log("Invention onLoad");
        super.onLoad();

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
    }

    onLevelUp(oldLevel, newLevel) {
        super.onLevelUp(oldLevel, newLevel);
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
    }

    passiveTick() {
        if(this.isActive)
            return;
    }

    onPageChange() {

    }

    render() {
        super.render();
    }

    registerData(namespace, data) {
        console.log("Invention registerData");
        super.registerData(namespace, data); // pets, rareDrops, minibar, customMilestones

        data.perks.forEach(data => {
            let perk = new InventionPerk(namespace, data, this.game);
            this.perks.registerObject(perk);
        });
    }

    postDataRegistration() {
        console.log("Invention postDataRegistration");
        super.postDataRegistration(); // Milestones setLevel
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

        /*writer.writeComplexMap(this.augmentedWeapons.registeredObjects, (key, value, writer) => {
            writer.writeString(value.localID);
            value.encode(writer);
        });

        writer.writeComplexMap(this.augmentedEquipment.registeredObjects, (key, value, writer) => {
            writer.writeString(value.localID);
            value.encode(writer);
        });*/
        
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
                let value = new InventionGizmo({id: key});
                value.decode(reader);
                this.gizmos.registerObject(value);
                this.game.items.registerObject(value);
                return { key, value };
            });

            reader.getArray((reader) => {
                let key = reader.getString();
                let isWeapon = key[0] === "w";
                let value = isWeapon ? new InventionAugmentedWeaponItem({id: key}) : new InventionAugmentedEquipmentItem({id: key});
                value.decode(reader);
                if(isWeapon) {
                    this.augmentedWeapons.registerObject(value);
                } else {
                    this.augmentedEquipment.registerObject(value);
                }
                this.game.items.registerObject(value);
                return { key, value };
            });
        } catch(e) { // Something's fucky, dump all progress and skip past the trash save data
            console.log(e);
            reader.byteOffset = start;
            reader.getFixedLengthBuffer(skillDataSize);
        }

        let end = reader.byteOffset;
        console.log(`Read ${end-start} bytes for Invention save`);
    }
}

