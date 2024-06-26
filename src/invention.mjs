const { loadModule, getResourceUrl } = mod.getContext(import.meta);

const { InventionPageUIComponent } = await loadModule('src/components/invention.mjs');
const { InventionGizmoModalUIComponent } = await loadModule('src/components/invention-gizmo-modal.mjs');
const { InventionGameGuideComponent } = await loadModule('src/components/invention-game-guide.mjs');


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
        this.item = item || this.game.emptyEquipmentItem;
        this._gizmos = new Set();
        this._xp = 0;
    }

    /* Base Item */
    set _name(_) { }
    get _name() {
        return this.item._name;
    }
    set _customDescription(_) { }
    get _customDescription() {
        return this.item._customDescription;
    }
    set category(_) { }
    get category() {
        return this.item.category;
    }
    set type(_) { }
    get type() {
        return this.item.type;
    }
    set _media(_) { }
    get _media() {
        return this.item._media;
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
    set _mediaAnimation(_) { }
    get _mediaAnimation() {
        return this.item._mediaAnimation;
    }
    set _altMedia(_) { }
    get _altMedia() {
        return this.item._altMedia;
    }
    set sellsFor(_) { }
    get sellsFor() {
        return this.item.sellsFor;
    }
    set _isArtefact(_) { }
    get _isArtefact() {
        return this.item._isArtefact;
    }
    set _isGenericArtefact(_) { }
    get _isGenericArtefact() {
        return this.item._isGenericArtefact;
    }
    set modQuery(_) { }
    get modQuery() {
        return this.item.modQuery;
    }
    get name() {
        let name = this.item.name;
        if(this.item === game.emptyEquipmentItem)
            name = "Old Modded Content"
        return `Augmented ${name}`;
    }
    get wikiName() {
        return this.item.wikiName;
    }
    get media() {
        return this.item.media;
    }
    get altMedia() {
        return this.item.altMedia;
    }
    get description() {
        let gizmos = [...this._gizmos];
        let gizmoString = '';
        for(let i=0; i<this.slots; i++) {
            if(gizmos[i] !== undefined) {
                gizmoString += `<div class="col-12">${gizmos[i].description}</div>`
            } else {
                gizmoString += `<div class="col-12"><span class="text-gizmo">Empty ${this.gizmoType} Gizmo Slot</span></div>`
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
    get modifiedDescription() {
        if (this._modifiedDescription !== undefined)
            return this._modifiedDescription;
        let desc = applyDescriptionModifications(this.description);
        if (this.isArtefact) {
            desc += desc.length > 0 ? '<br>' : '';
            desc += `${this.artefactSizeAndLocation}`;
        }
        if (this.isGenericArtefact && setLang == 'en') {
            desc += desc.length > 0 ? '<br>' : '';
            desc += `This is a Generic Artefact.`;
        }
        this._modifiedDescription = desc;
        return this._modifiedDescription;
    }
    get artefactSizeAndLocation() {
        return this.item.artefactSizeAndLocation;
    }
    get hasDescription() {
        return true;
    }
    get isArtefact() {
        return this.item.isArtefact;
    }
    get isGenericArtefact() {
        return this.item.isGenericArtefact;
    }

    /* Base Equipment */
    set cantEquipWith(_) { }
    get cantEquipWith() {
        return this.item.cantEquipWith;
    }
    set equipRequirements(_) { }
    get equipRequirements() {
        return this.item.equipRequirements;
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
    set deathPenaltyPriority(_) { }
    get deathPenaltyPriority() {
        return this.item.deathPenaltyPriority;
    }
    set tier(_) { }
    get tier() {
        return this.item.tier;
    }
    set validSlots(_) { }
    get validSlots() {
        if(this.item === game.emptyEquipmentItem)
            return game.equipmentSlots.allObjects;
        return this.item.validSlots;
    }
    set occupiesSlots(_) { }
    get occupiesSlots() {
        return this.item.occupiesSlots;
    }
    set equipmentStats(_) { }
    get equipmentStats() {
        return this.item.equipmentStats;
    }
    set combatEffects(_) { }
    get combatEffects() {
        return this.item.combatEffects;
    }
    set modifiers(_) { }
    get modifiers() {
        return this.item.modifiers;
    }
    set enemyModifiers(_) { }
    get enemyModifiers() {
        return this.item.enemyModifiers;
    }
    set ammoType(_) { }
    get ammoType() {
        return this.item.ammoType;
    }
    set consumesOn(_) { }
    get consumesOn() {
        return this.item.consumesOn;
    }
    set consumesChargesOn(_) { }
    get consumesChargesOn() {
        return this.item.consumesChargesOn;
    }
    set consumesItemOn(_) { }
    get consumesItemOn() {
        return this.item.consumesItemOn;
    }

    get baseItem() {
        if(this.item.baseItem !== undefined)
            this.item.baseItem;
        return this.item;
    }
    set slots(_) { }
    get slots() {
        let validSlots = this.item.validSlots.map(slot => slot._localID);
        return validSlots.includes('Platebody') || validSlots.includes('Platelegs') ? 2 : 1;
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
        return this.manager.equipment_xp[Math.min(this.level, this.manager.equipment_xp.length-1)];
    }
    set level(_) { }
    get level() {
        return Math.min(this.manager.maxEquipmentLevel(), this.manager.equipmentXPToLevel(this._xp));
    }

    set gizmoType(_) { }
    get gizmoType() {
        let validSlots = this.item.validSlots.map(slot => slot._localID);
        if(validSlots.includes('Gloves') || validSlots.includes('Amulet') || validSlots.includes('Ring') || validSlots.includes('Cape'))
            return "Weapon"
        return "Armour"
    }

    canEquipGizmo(gizmo) {
        if(this.gizmoType === "Weapon")
            return this.manager.isWeaponGizmo(gizmo);
        return this.manager.isArmourGizmo(gizmo);
    }

    addXP(xp) {
        this._xp += xp;
        this._modifiedDescription = undefined;
        game.combat.player.renderQueue.equipment = true;
    }

    resetXP() {
        this._xp = 0;
        this._modifiedDescription = undefined;
        game.combat.player.renderQueue.equipment = true;
    }
    
    attachGizmo(gizmo) {
        if(gizmo.attachedTo !== undefined)
            return false;
        if(this._gizmos.size >= this.slots)
            return false;
        this._gizmos.add(gizmo);
        this._modifiedDescription = undefined;
        console.log("Attached Gizmo ", gizmo.id, " to ", this.id);
        return true;
    }

    removeGizmo(gizmo) {
        if(!this._gizmos.has(gizmo))
            return false;
        this._gizmos.delete(gizmo);
        this._modifiedDescription = undefined;
        console.log("Removed Gizmo ", gizmo.id, " from ", this.id);
        return true;
    }

    encode(writer) {
        writer.writeNamespacedObject(this.item);
        writer.writeUint32(this._xp);
        writer.writeSet(this._gizmos, (gizmo, writer) => {
            writer.writeNamespacedObject(gizmo);
        });
    }

    decode(reader) {
        this.item = reader.getNamespacedObject(this.game.items);
        if(typeof this.item === 'string') {
            this._postLoadID = this.item;
            this.item = this.game.emptyEquipmentItem;
        }
        this._xp = reader.getUint32();
        this._gizmos = reader.getSet((reader) => {
            return reader.getNamespacedObject(this.manager.gizmos);
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
        this.item = item || this.game.emptyEquipmentItem;
        this._gizmos = new Set();
        this._xp = 0;
    }

    /* Base Item */
    set _name(_) { }
    get _name() {
        return this.item._name;
    }
    set _customDescription(_) { }
    get _customDescription() {
        return this.item._customDescription;
    }
    set category(_) { }
    get category() {
        return this.item.category;
    }
    set type(_) { }
    get type() {
        return this.item.type;
    }
    set _media(_) { }
    get _media() {
        return this.item._media;
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
    set _mediaAnimation(_) { }
    get _mediaAnimation() {
        return this.item._mediaAnimation;
    }
    set _altMedia(_) { }
    get _altMedia() {
        return this.item._altMedia;
    }
    set sellsFor(_) { }
    get sellsFor() {
        return this.item.sellsFor;
    }
    set _isArtefact(_) { }
    get _isArtefact() {
        return this.item._isArtefact;
    }
    set _isGenericArtefact(_) { }
    get _isGenericArtefact() {
        return this.item._isGenericArtefact;
    }
    set modQuery(_) { }
    get modQuery() {
        return this.item.modQuery;
    }
    get name() {
        let name = this.item.name;
        if(this.item === game.emptyEquipmentItem)
            name = "Old Modded Content"
        return `Augmented ${name}`;
    }
    get wikiName() {
        return this.item.wikiName;
    }
    get media() {
        return this.item.media;
    }
    get altMedia() {
        return this.item.altMedia;
    }
    set description(_) { }
    get description() {
        let gizmos = [...this._gizmos];
        let gizmoString = '';
        for(let i=0; i<this.slots; i++) {
            if(gizmos[i] !== undefined) {
                gizmoString += `<div class="col-12">${gizmos[i].description}</div>`
            } else {
                gizmoString += `<div class="col-12"><span class="text-gizmo">Empty ${this.gizmoType} Gizmo Slot</span></div>`
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
    get modifiedDescription() {
        if (this._modifiedDescription !== undefined)
            return this._modifiedDescription;
        let desc = applyDescriptionModifications(this.description);
        if (this.isArtefact) {
            desc += desc.length > 0 ? '<br>' : '';
            desc += `${this.artefactSizeAndLocation}`;
        }
        if (this.isGenericArtefact && setLang == 'en') {
            desc += desc.length > 0 ? '<br>' : '';
            desc += `This is a Generic Artefact.`;
        }
        this._modifiedDescription = desc;
        return this._modifiedDescription;
    }
    get artefactSizeAndLocation() {
        return this.item.artefactSizeAndLocation;
    }
    get hasDescription() {
        return true;
    }
    get isArtefact() {
        return this.item.isArtefact;
    }
    get isGenericArtefact() {
        return this.item.isGenericArtefact;
    }

    /* Base Equipment */
    set cantEquipWith(_) { }
    get cantEquipWith() {
        return this.item.cantEquipWith;
    }
    set equipRequirements(_) { }
    get equipRequirements() {
        return this.item.equipRequirements;
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
    set deathPenaltyPriority(_) { }
    get deathPenaltyPriority() {
        return this.item.deathPenaltyPriority;
    }
    set tier(_) { }
    get tier() {
        return this.item.tier;
    }
    set validSlots(_) { }
    get validSlots() {
        if(this.item === game.emptyEquipmentItem)
            return game.equipmentSlots.allObjects;
        return this.item.validSlots;
    }
    set occupiesSlots(_) { }
    get occupiesSlots() {
        return this.item.occupiesSlots;
    }
    set equipmentStats(_) { }
    get equipmentStats() {
        return this.item.equipmentStats;
    }
    set combatEffects(_) { }
    get combatEffects() {
        return this.item.combatEffects;
    }
    set modifiers(_) { }
    get modifiers() {
        return this.item.modifiers;
    }
    set enemyModifiers(_) { }
    get enemyModifiers() {
        return this.item.enemyModifiers;
    }
    set ammoType(_) { }
    get ammoType() {
        return this.item.ammoType;
    }
    set consumesOn(_) { }
    get consumesOn() {
        return this.item.consumesOn;
    }
    set consumesChargesOn(_) { }
    get consumesChargesOn() {
        return this.item.consumesChargesOn;
    }
    set consumesItemOn(_) { }
    get consumesItemOn() {
        return this.item.consumesItemOn;
    }
    /* Base Weapon */
    set attackType(_) { }
    get attackType() {
        if(this.item === game.emptyEquipmentItem)
            return 'melee';
        return this.item.attackType;
    }
    set damageType(_) { }
    get damageType() {
        if(this.item === game.emptyEquipmentItem)
            return game.normalDamage;
        return this.item.damageType;
    }
    set ammoTypeRequired(_) { }
    get ammoTypeRequired() {
        return this.item.ammoTypeRequired;
    }

    get baseItem() {
        if(this.item.baseItem !== undefined)
            this.item.baseItem;
        return this.item;
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

    set gizmoType(_) { }
    get gizmoType() {
        return "Weapon"
    }

    canEquipGizmo(gizmo) {
        return this.manager.isWeaponGizmo(gizmo);
    }

    addXP(xp) {
        this._xp += xp;
        this._modifiedDescription = undefined;
        game.combat.player.renderQueue.equipment = true;
    }

    resetXP() {
        this._xp = 0;
        this._modifiedDescription = undefined;
        game.combat.player.renderQueue.equipment = true;
    }

    attachGizmo(gizmo) {
        if(gizmo.attachedTo !== undefined)
            return;
        if(this._gizmos.size >= this.slots)
            return;
        this._gizmos.add(gizmo);
        this._modifiedDescription = undefined;
        console.log("Attached Gizmo ", gizmo.id, " to ", this.id);
        return true;
    }

    removeGizmo(gizmo) {
        if(!this._gizmos.has(gizmo))
            return false;
        this._gizmos.delete(gizmo);
        this._modifiedDescription = undefined;
        console.log("Removed Gizmo ", gizmo.id, " from ", this.id);
        return true;
    }

    encode(writer) {
        writer.writeNamespacedObject(this.item);
        writer.writeFloat32(this._xp);
        writer.writeSet(this._gizmos, (gizmo, writer) => {
            writer.writeNamespacedObject(gizmo);
        });
    }

    decode(reader) {
        this.item = reader.getNamespacedObject(game.items);
        if(typeof this.item === 'string') {
            this._postLoadID = this.item;
            this.item = this.game.emptyEquipmentItem;
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
        this.item = item || this.game.emptyEquipmentItem;
        this._perks = new Map();
    }
    /* Base Item */
    set _name(_) { }
    get _name() {
        return this.item._name;
    }
    set _customDescription(_) { }
    get _customDescription() {
        return this.item._customDescription;
    }
    set category(_) { }
    get category() {
        return this.item.category;
    }
    set type(_) { }
    get type() {
        return this.item.type;
    }
    set _media(_) { }
    get _media() {
        return this.item._media;
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
    set _mediaAnimation(_) { }
    get _mediaAnimation() {
        return this.item._mediaAnimation;
    }
    set _altMedia(_) { }
    get _altMedia() {
        return this.item._altMedia;
    }
    set sellsFor(_) { }
    get sellsFor() {
        return this.item.sellsFor;
    }
    set _isArtefact(_) { }
    get _isArtefact() {
        return this.item._isArtefact;
    }
    set _isGenericArtefact(_) { }
    get _isGenericArtefact() {
        return this.item._isGenericArtefact;
    }
    set modQuery(_) { }
    get modQuery() {
        return this.item.modQuery;
    }
    get name() {
        return this.item.name;
    }
    get wikiName() {
        return this.item.wikiName;
    }
    get media() {
        return this.item.media;
    }
    get altMedia() {
        return this.item.altMedia;
    }
    set description(_) { }
    get description() {
        return `<div class="row no-gutters">
            ${[...this.perks.entries()].map(([perk, rank]) => {
                return typeof perk === "string" ? perk : perk.descriptionForRank(rank);
            }).join('')}
        </div>`;
    }
    get modifiedDescription() {
        if (this._modifiedDescription !== undefined)
            return this._modifiedDescription;
        let desc = applyDescriptionModifications(this.description);
        if (this.isArtefact) {
            desc += desc.length > 0 ? '<br>' : '';
            desc += `${this.artefactSizeAndLocation}`;
        }
        if (this.isGenericArtefact && setLang == 'en') {
            desc += desc.length > 0 ? '<br>' : '';
            desc += `This is a Generic Artefact.`;
        }
        this._modifiedDescription = desc;
        return this._modifiedDescription;
    }
    get artefactSizeAndLocation() {
        return this.item.artefactSizeAndLocation;
    }
    get hasDescription() {
        return true;
    }
    get isArtefact() {
        return this.item.isArtefact;
    }
    get isGenericArtefact() {
        return this.item.isGenericArtefact;
    }

    set perks(_) { }
    get perks() {
        return this._perks;
    }
    set attachedTo(_) { }
    get attachedTo() {
        let augmentedItems = [...game.invention.armour.allObjects, ...game.invention.weapons.allObjects];
        return augmentedItems.find((item => item.gizmos.has(this)));
    }

    setPerks(perks) {
        this._perks.clear();
        perks.forEach((value, key) => {
            this._perks.set(key, value);
        });
        this._modifiedDescription = undefined;
    }

    encode(writer) {
        writer.writeNamespacedObject(this.item);
        writer.writeComplexMap(this._perks, (key, value, writer) => {
            writer.writeNamespacedObject(key);
            writer.writeUint8(value);
        });
    }

    decode(reader) {
        this.item = reader.getNamespacedObject(game.items);
        if(typeof this.item === 'string') {
            this._postLoadID = this.item;
            this.item = this.game.emptyEquipmentItem;
        }
        reader.getComplexMap((reader) => {
            let key = reader.getNamespacedObject(game.invention.perks);
            let value = reader.getUint8();
            if(typeof key !== 'string')
                this._perks.set(key, value);
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
        game.queueForSoftDependencyReg(data, this);
    }
    registerSoftDependencies(data, game) {
        if(data.unlockRequirements)
            this.unlockRequirements = data.unlockRequirements.map((req)=>game.getRequirementFromData(req));
    }

    get unlocked() {
        if (this.unlockRequirements !== undefined) {
            return game.checkRequirements(this.unlockRequirements);
        } else {
            return true;
        }
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

class InventionDiscovery extends NamespacedObject {
    constructor(namespace, data, manager, game) {
        super(namespace, data.id);
        this.manager = manager;
        this.game = game;
        this._name = data.name;
        this._media = data.media;
        this.level = data.level;
        this.baseExperience = data.baseExperience;
    }
    get name() {
        return this._name;
    }
    get media() {
        return this.getMediaURL(this._media);
    }
    get description() {
        return this.name;
    }
}

class InventionPerk extends NamespacedObject {
    constructor(namespace, data, manager, game) {
        super(namespace, data.id);
        this.manager = manager;
        this.game = game;
        this._name = data.name;
        this._media = data.media;
        this.ranks = data.ranks;
        if(data.customDescription !== undefined)
            this._customDescription = data.customDescription;
        
        if (data.providedRunes !== undefined)
            this.providedRunes = this.game.items.getQuantities(data.providedRunes);
        
        this.game.queueForSoftDependencyReg(data, this);
    }
    get name() {
        return this._name;
    }
    get media() {
        return this.getMediaURL(this._media);
    }

    registerSoftDependencies(data, game) {
        if (data.modifiers !== undefined) {
            this.rankedModifiers = Array.isArray(data.modifiers);
            if(this.rankedModifiers) {
                this.modifiers = data.modifiers.map(modifiers => {
                    try {
                        return game.getModifierValuesFromData(modifiers)
                    } catch(e) {
                        console.log(`${modifiers} failed to load`);
                        return [];
                    }
                });
            } else {
                try {
                    this.modifiers = game.getModifierValuesFromData(data.modifiers);
                } catch(e) {
                    console.log(`${Object.keys(data.modifiers)} failed to load`);
                    this.modifiers = undefined;
                }
            }
        }

        if(data.combatEffect !== undefined) {
            if(Array.isArray(data.combatEffect)) {
                this.combatEffects = data.combatEffect.map(effect => {
                    try {
                        return game.getCombatEffectApplicatorWithTriggerFromData(effect);
                    } catch(e) {
                        let id = data.combatEffect.effectID;
                        if(id === undefined)
                            id = data.combatEffect.tableID;
                        console.log(`${id} failed to load`);
                        return undefined;
                    }
                }).filter(effect => effect !== undefined);
            } else {
                this.combatEffects = data.ranks.map(({rank}) => {
                    try {
                        let effect = {
                            ...data.combatEffect,
                        };
                        if(effect.id !== undefined)
                            effect.effectID = `${effect.effectID}_${rank}`
                        if(effect.chance !== undefined)
                            effect.chance = effect.chance * rank;
                        
                        return game.getCombatEffectApplicatorWithTriggerFromData(effect)
                    } catch(e) {
                        let id = data.combatEffect.effectID;
                        if(id === undefined)
                            id = data.combatEffect.tableID;
                        console.log(`${id} failed to load`);
                        return undefined;
                    }
                }).filter(effect => effect !== undefined);
            }
        }

        if (data.enemyModifiers !== undefined) {
            this.rankedEnemyModifiers = Array.isArray(data.enemyModifiers);
            if(this.rankedEnemyModifiers) {
                this.enemyModifiers = data.modifiers.map(enemyModifiers => {
                    try {
                        return game.getModifierValuesFromData(enemyModifiers)
                    } catch(e) {
                        console.log(`${enemyModifiers} failed to load`);
                        return [];
                    }
                });
            } else {
                try {
                    this.enemyModifiers = game.getModifierValuesFromData(data.enemyModifiers);
                } catch(e) {
                    console.log(`${Object.keys(data.enemyModifiers)} failed to load`);
                    this.enemyModifiers = undefined;
                }
            }
        }
    }

    modifiersForRank(rank) {
        if(this.modifiers !== undefined) {
            if(this.rankedModifiers) {
                if(this.modifiers[rank-1] !== undefined) {
                    return this.modifiers[rank-1];
                } else {
                    return this.modifiers[this.modifiers.length-1];
                }
            } else {
                return this.modifiers;
            }
        }
    }

    enemyModifiersForRank(rank) {
        if(this.enemyModifiers !== undefined) {
            if(this.rankedEnemyModifiers) {
                if(this.enemyModifiers[rank-1] !== undefined) {
                    return this.enemyModifiers[rank-1];
                } else {
                    return this.enemyModifiers[this.enemyModifiers.length-1];
                }
            } else {
                return this.enemyModifiers;
            }
        }
    }

    combatEffectForRank(rank) {
        if(this.combatEffects !== undefined) {
            if(this.combatEffects[rank-1] !== undefined) {
                return this.combatEffects[rank-1];
            } else {
                return this.combatEffects[this.combatEffects.length-1];
            }
        }
    }

    descriptionForRank(rank) {
        let rankScale = this.rankedModifiers ? 1 : rank;

        let extra = [];

        let mods = this.modifiersForRank(rank);
        if(mods !== undefined)
            extra.push(...getModifierDataSpans(mods, rankScale, rankScale));

        let enemyMods = this.enemyModifiersForRank(rank);
        if(enemyMods !== undefined)
            extra.push(...getModifierDataSpans(enemyMods, rankScale, rankScale));

        let combatEffect = this.combatEffectForRank(rank);
        if(combatEffect !== undefined) {
            let { text } = combatEffect.getDescription();
            extra.push(text);
        }
        
        let name = `<span class="text-gizmo">${this.name} Rank ${rank}</span>`;
        let desc = `</br>${[...extra].join('</br>')}`;

        //if(this._customDescription !== undefined)
        //    desc = `</br><span class="text-success">${this._customDescription}</span>`;

        return `<div class="col-12">${name}${desc}</div>`
    }
}

class InventionComponentItem extends Item {
    constructor(namespace, data, manager, game) {
        super(namespace, data, game);
        this.manager = manager;
        this.game = game;
        this.perks = data.perks;

        this._customDescription = this.generateDescription();
        game.queueForSoftDependencyReg(data, this);
    }

    registerSoftDependencies(data, game) {
        if(data.unlockRequirements)
            this.unlockRequirements = data.unlockRequirements.map((req)=>game.getRequirementFromData(req));
    }

    get unlocked() {
        if (this.unlockRequirements !== undefined) {
            return game.checkRequirements(this.unlockRequirements);
        } else {
            return true;
        }
    }

    generateDescription() {
        let weaponPerks = this.perks.weapon.map(({perkID, base, roll}) => {
            let perk = this.game.invention.perks.getObjectByID(perkID);
            return `<span class="text-success">${perk.name} (${base}-${base+roll})</span>`;
        });
        let armourPerks = this.perks.armour.map(({perkID, base, roll}) => {
            let perk = this.game.invention.perks.getObjectByID(perkID);
            return `<span class="text-success">${perk.name} (${base}-${base+roll})</span>`;
        });
        let desc = `<span>Weapon Perk Values</span></br>
        ${weaponPerks.join('</br>')}</br>
        <span>Armour Perk Values</span></br>
        ${armourPerks.join('</br>')}`;
        return `<div class="col-12">${desc}</div>`
    }
}

class MaterialsDropTable extends DropTable {
    constructor(game, data, count=5, requires=1) {
        super(game, data);
        this.count = count;
        this.requires = requires;
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

const { InventionDiscover } = await loadModule('src/invention-discover.mjs');
const { InventionWorkbench } = await loadModule('src/invention-workbench.mjs');
const { InventionDisassemble } = await loadModule('src/invention-disassemble.mjs');
const { InventionAugmentation } = await loadModule('src/invention-augmentation.mjs');
const { InventionGizmoTable } = await loadModule('src/invention-gizmo-table.mjs');

export class Invention extends Skill {
    constructor(namespace, game) {
        super(namespace, 'Invention', game);
        this.version = 1;
        this.saveVersion = -1;
        this._media = 'assets/invention.png';
        this.renderQueue = new InventionRenderQueue();
        this.isActive = false;

        this.discoveries = new NamespaceRegistry(this.game.registeredNamespaces);

        this.armour = new NamespaceRegistry(this.game.registeredNamespaces);
        this.weapons = new NamespaceRegistry(this.game.registeredNamespaces);

        this.gizmos = new NamespaceRegistry(this.game.registeredNamespaces);

        this.perks = new NamespaceRegistry(this.game.registeredNamespaces);

        this.components = new NamespaceRegistry(this.game.registeredNamespaces);

        this.component = new InventionPageUIComponent();
        this.gizmoModal = new InventionGizmoModalUIComponent(this, game);
        this.gameGuide = new InventionGameGuideComponent(this, game);

        this.overview = new InventionOverview(this, this.game);
        this.overview.component.mount(this.component.overview);

        this.pages = new InventionPages(this, this.game);

        this.discover = new InventionDiscover(this, this.game);
        this.workbench = new InventionWorkbench(this, this.game);
        this.disassemble = new InventionDisassemble(this, this.game);
        this.augmentation = new InventionAugmentation(this, this.game);
        this.gizmo_table = new InventionGizmoTable(this, this.game);

        this.pages.register('discover', this.discover);
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
        this.researched = new Map();

        console.log("Invention constructor done");
    }

    checkDiscoveryResearchedRequirement(requirement, notifyOnFailure=false) {
        const met = this.researched.get(requirement.discovery) === true;
        if (!met && notifyOnFailure) {
            imageNotify(this.media, `${requirement.discovery.name} required.`, 'danger');
        }
        return met;
    }

    hasResearched(id) {
        let discovery = this.discoveries.getObjectByID(id);
        return this.researched.get(discovery) === true;
    }

    getCurrentPerks() {
        let perks = new Map();
        game.combat.player.equipment.equippedArray.forEach(equipmentSlot => {
            if(!equipmentSlot.isEmpty && equipmentSlot.occupiedBy === undefined && this.isAugmentedItem(equipmentSlot.item)) {
                equipmentSlot.item.gizmos.forEach(gizmo => {
                    gizmo.perks.forEach((rank, perk) => {
                        let old = perks.get(perk);
                        if(old === undefined || old < rank)
                            perks.set(perk, rank);
                    });
                });
            }
        });
        return perks;
    }

    addEquippedItemModifiers(player) {
        let perks = this.getCurrentPerks();
        perks.forEach((rank, perk) => {
            if(perk.modifiers !== undefined) {
                let modifiers = perk.modifiersForRank(rank);
                let rankScale = perk.rankedModifiers ? 1 : rank;
                player.modifiers.addModifiers(perk, modifiers, rankScale, rankScale);
            }
        });
    }

    addPlayerEquipmentModifiers(enemy) {
        let perks = this.getCurrentPerks();
        perks.forEach((rank, perk) => {
            if(perk.enemyModifiers !== undefined) {
                let enemyModifiers = perk.enemyModifiersForRank(rank);
                let rankScale = perk.rankedEnemyModifiers ? 1 : rank;
                enemy.modifiers.addModifiers(perk, enemyModifiers, rankScale, rankScale);
            }
        });
    }

    mergeInheritedEffectApplicators(player) {
        let perks = this.getCurrentPerks();
        perks.forEach((rank, perk) => {
            if(perk.combatEffects !== undefined) {
                let combatEffect = perk.combatEffectForRank(rank);
                player.mergeEffectApplicator(combatEffect);
            }
        });
    }

    maxEquipmentLevel() {
        if(this.level >= 99 && this.hasResearched('invention:Augment20'))
            return 20;
        if(this.level >= 60 && this.hasResearched('invention:Augment15'))
            return 15;
        if(this.level >= 27 && this.hasResearched('invention:Augment10'))
            return 10;
        if(this.level >= 4 && this.hasResearched('invention:Augment5'))
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
        this.game.shop.upgradesPurchased.set(this.game.shop.purchases.getObjectByID('melvorD:Extra_Bank_Slot'), 1000)
        this.game.shop.computeProvidedStats();
        
        this.game.bank.addItem(this.game.items.getObjectByID('melvorD:Strawberry_Cupcake_Perfect'), 1e6, false, false, true, false);

        this.game.bank.addItem(this.game.items.getObjectByID('melvorD:Bronze_Bar'), 50000, false, false, true, false);

        this.game.bank.addItem(this.game.items.getObjectByID('melvorD:Bronze_Sword'), 5, false, false, true, false);
        this.game.bank.addItem(this.game.items.getObjectByID('melvorD:Bronze_Shield'), 5, false, false, true, false);
        this.game.bank.addItem(this.game.items.getObjectByID('melvorD:Bronze_2H_Sword'), 5, false, false, true, false);

        this.game.bank.addItem(this.game.items.getObjectByID('melvorD:Bronze_Helmet'), 5, false, false, true, false);
        this.game.bank.addItem(this.game.items.getObjectByID('melvorD:Bronze_Boots'), 5, false, false, true, false);
        this.game.bank.addItem(this.game.items.getObjectByID('melvorD:Bronze_Gloves'), 5, false, false, true, false);
        this.game.bank.addItem(this.game.items.getObjectByID('melvorD:Bronze_Platebody'), 5, false, false, true, false);
        this.game.bank.addItem(this.game.items.getObjectByID('melvorD:Bronze_Platelegs'), 5, false, false, true, false);

        this.game.bank.addItem(this.game.items.getObjectByID('melvorD:Amulet_of_Strength'), 5, false, false, true, false);
        this.game.bank.addItem(this.game.items.getObjectByID('melvorD:Gold_Topaz_Ring'), 5, false, false, true, false);
        this.game.bank.addItem(this.game.items.getObjectByID('melvorD:Obsidian_Cape'), 5, false, false, true, false);

        this.game.bank.addItem(this.game.items.getObjectByID('invention:Augmentor'), 20, false, false, true, false);
        this.game.bank.addItem(this.game.items.getObjectByID('invention:Weapon_Gizmo_Shell'), 50, false, false, true, false);
        this.game.bank.addItem(this.game.items.getObjectByID('invention:Armour_Gizmo_Shell'), 50, false, false, true, false);
        this.game.bank.addItem(this.game.items.getObjectByID('invention:Equipment_Siphon'), 20, false, false, true, false);

        this.game.items.allObjects.filter(item => item.type === "Parts" || item.type === "Components").forEach(part => this.game.bank.addItem(part, 1000, false, false, true, false))
    }

    addAllGizmos() {
        let item = game.items.getObjectByID('invention:Weapon_Gizmo');
        game.invention.perks.forEach(perk => {
            perk.ranks.forEach(({rank}) => {
                let perks = new Map();
                perks.set(perk, rank);
                let giz = new InventionGizmo({item}, game.invention, game);
                giz.setPerks(perks);
                game.invention.gizmos.registerObject(giz);
                game.items.registerObject(giz);
                game.bank.addItem(giz, 1, false, false, true);
            });
        });
    }

    

    makeUpgrades(item) {
        // Create Downgrade to base item
        let downgrade = new ItemUpgrade({
            itemCosts: [{
                id: item.id,
                quantity: 1
            },
            {
                id: 'invention:Augmentation_Dissolver',
                quantity: 1
            }],
            gpCost: 0,
            scCost: 0,
            rootItemIDs: [item.id],
            upgradedItemID: item.item.id,
            isDowngrade: true,
            upgradedQuantity: 1
        }, game);

        // Add Downgrade
        downgrade.rootItems.forEach((root)=>{
            let upgradeArray = game.bank.itemUpgrades.get(root);
            if (upgradeArray === undefined) {
                upgradeArray = [];
                game.bank.itemUpgrades.set(root, upgradeArray);
            }
            upgradeArray.push(downgrade);
        });
    }

    handleMissingObject(namespacedID) {
        let [ namespace, id ] = namespacedID.split(':');
        let obj;
        switch (id[0]) {
            case "w":
                if(this.weapons.getObject(namespace, id) !== undefined)
                    return this.weapons.getObject(namespace, id);
                obj = new InventionAugmentedWeaponItem({id}, this, this.game);
                this.weapons.registerObject(obj);
                break;
            case "e":
                if(this.armour.getObject(namespace, id) !== undefined)
                    return this.armour.getObject(namespace, id);
                obj = new InventionAugmentedEquipmentItem({id}, this, this.game);
                this.armour.registerObject(obj);
                break;
            case "g":
                if(this.gizmos.getObject(namespace, id) !== undefined)
                    return this.gizmos.getObject(namespace, id);
                obj = new InventionGizmo({id}, this, this.game);
                this.gizmos.registerObject(obj);
                break;
            default:
                break;
        }
        if(obj !== undefined)
            this.game.items.registerObject(obj);
        return obj;
    }

    createAugmentedWeapon(item) {
        if(!(item instanceof WeaponItem))
            return;
        if(item.ammoType === AmmoTypeID.Javelins || item.ammoType === AmmoTypeID.ThrowingKnives)
            return;
        let augmentedItem = new InventionAugmentedWeaponItem({item}, this, this.game);
        this.weapons.registerObject(augmentedItem);
        this.game.items.registerObject(augmentedItem);
        console.log("Created Augmented Weapon:", augmentedItem.id, augmentedItem.name);
        this.makeUpgrades(augmentedItem);
        return augmentedItem;
    }

    createAugmentedArmour(item) {
        if(!(item instanceof EquipmentItem) || item instanceof WeaponItem)
            return;
        let validSlots = item.validSlots.map(slot => slot._localID);
        if(!validSlots.includes('Shield') &&
           !validSlots.includes('Platebody') &&
           !validSlots.includes('Platelegs') &&
           !validSlots.includes('Amulet') &&
           !validSlots.includes('Boots') &&
           !validSlots.includes('Cape') &&
           !validSlots.includes('Gloves') &&
           !validSlots.includes('Helmet') &&
           !validSlots.includes('Ring'))
            return;
        let augmentedItem = new InventionAugmentedEquipmentItem({item}, this, this.game);
        this.armour.registerObject(augmentedItem);
        this.game.items.registerObject(augmentedItem);
        console.log("Created Augmented Armour:", augmentedItem.id, augmentedItem.name);
        this.makeUpgrades(augmentedItem);
        return augmentedItem;
    }

    createAugmentedItem(item) {
        if(!(item instanceof EquipmentItem))
            return;
        if(item instanceof WeaponItem) {
            return this.createAugmentedWeapon(item);
        } else if (item instanceof EquipmentItem) {
            return this.createAugmentedArmour(item);
        }
    }

    isAugmentedItem(item) {
        return item instanceof InventionAugmentedEquipmentItem || item instanceof InventionAugmentedWeaponItem;
    }

    isAugmentedWeapon(item) {
        return item instanceof InventionAugmentedWeaponItem;
    }

    isAugmentedArmour(item) {
        return item instanceof InventionAugmentedEquipmentItem;
    }

    canAugmentItem(item) {
        if(this.isAugmentedItem(item))
            return false;
        // Cape, Ring, Amulet
        if(item instanceof WeaponItem && !(item.ammoType === AmmoTypeID.Javelins || item.ammoType === AmmoTypeID.ThrowingKnives))
            return true;
        // Helmet, Boots, Gloves
        let validSlots = item instanceof EquipmentItem && item.validSlots.map(slot => slot._localID);
        if(item instanceof EquipmentItem && (validSlots.includes('Shield') ||
            (validSlots.includes('Platebody') && this.hasResearched('invention:AugmentPlatebody')) ||
            (validSlots.includes('Platelegs') && this.hasResearched('invention:AugmentPlatelegs')) ||
            (validSlots.includes('Amulet') && this.hasResearched('invention:AugmentAmulet')) ||
            (validSlots.includes('Boots') && this.hasResearched('invention:AugmentBoots')) ||
            (validSlots.includes('Cape') && this.hasResearched('invention:AugmentCape')) ||
            (validSlots.includes('Gloves') && this.hasResearched('invention:AugmentGloves')) ||
            (validSlots.includes('Helmet') && this.hasResearched('invention:AugmentHelmet')) ||
            (validSlots.includes('Ring') && this.hasResearched('invention:AugmentRing'))))
            return true;
        return false;
    }

    checkForGizmo(gizmo) {
        const hasGizmoOrProxied = (check) => (check.gizmos !== undefined && check.gizmos.has(gizmo) || (check.item !== undefined && hasGizmoOrProxied(check.item)));
        return this.game.bank.filterItems((bankItem) => bankItem.item === gizmo || hasGizmoOrProxied(bankItem.item)).length > 0 || this.game.combat.player.equipmentSets.some(({equipment})=> equipment.equippedArray.some(slot => hasGizmoOrProxied(slot.item)));
    }
    
    checkForItem(item) {
        const isItemOrProxied = (check) => (check === item || (check.item !== undefined && isItemOrProxied(check.item)));
        return this.game.bank.filterItems((bankItem) => isItemOrProxied(bankItem.item)).length > 0 || this.game.combat.player.equipmentSets.some(({equipment})=> equipment.equippedArray.some(slot => isItemOrProxied(slot.item)));
    }

    removeAugmentedItem(item) {
        if(!(item instanceof InventionAugmentedEquipmentItem || item instanceof InventionAugmentedWeaponItem))
            return;
        if(this.checkForItem(item))
            return;
        this.game.stats.Items.statsMap.delete(item);
        this.game.bank.glowingItems.delete(item);
        let sortIdx = this.game.bank.customSortOrder.indexOf(item);
        if(sortIdx > -1)
            this.game.bank.customSortOrder.splice(this.game.bank.customSortOrder.indexOf(item), 1);
        console.log("Removed Augmented Item:", item.id, item.name);
        if(item instanceof InventionAugmentedWeaponItem) {
            this.weapons.registeredObjects.delete(item.id);
        } else if (item instanceof InventionAugmentedEquipmentItem) {
            this.armour.registeredObjects.delete(item.id);
        }
        item.gizmos.forEach(gizmo => {
            this.removeGizmo(gizmo);
        });
    }

    showGizmoModal(item) {
        this.gizmoModal.setItem(item);
        $('#modal-invention-gizmos').modal('show');
    }

    isGizmo(item) {
        return item instanceof InventionGizmo;
    }

    isWeaponGizmo(item) {
        return item.item.id === 'invention:Weapon_Gizmo';
    }

    isArmourGizmo(item) {
        return item.item.id === 'invention:Armour_Gizmo';
    }

    isComponent(item) {
        return item instanceof InventionComponentItem;
    }

    onCharacterLoaded() {
        [...this.weapons.allObjects, ...this.armour.allObjects].filter(item => item._postLoadID !== undefined).forEach(item => {
            let itemID = item._postLoadID;
            delete item._postLoadID;
            console.log(`Looking for ${itemID}`);
            let postLoadItem = this.game.items.getObjectByID(itemID);
            if(postLoadItem !== undefined) {
                console.log(`Found ${postLoadItem.id}`)
                item.item = postLoadItem;

                let itemIcon = bankTabMenu.itemIcons.get(item)
                if(itemIcon !== undefined)
                    itemIcon.image.src = item.media;
                this.game.combat.player.renderQueue.equipment = true;
            } else {
                console.log(`Found nothing`)
                this.removeAugmentedItem(item);
            }
        });
        [...this.weapons.allObjects, ...this.armour.allObjects].filter(item => item.item === game.emptyEquipmentItem || !this.checkForItem(item)).forEach(item => {
            console.log(`Empty Item ${item.id}`)
            this.removeAugmentedItem(item);
        });
        this.gizmos.allObjects.filter(item => !this.checkForGizmo(item)).forEach(item => {
            console.log(`Unused Gizmo ${item.id}`)
            this.removeGizmo(item);
        });

        [...this.weapons.allObjects, ...this.armour.allObjects].forEach(item => {
            if(item.occupiesSlots.length > 0) {
                game.combat.player.equipmentSets.forEach(({equipment}) => {
                    equipment.equippedArray.forEach(slot => {
                        if(slot.item === item && slot.occupiedBy === undefined) {
                            slot.setEquipped(item, slot.quantity, item.occupiesSlots);
                            item.occupiesSlots.forEach((slotType)=>equipment.equippedItems[slotType.id].setOccupied(item, slot.slot));
                            this.game.combat.player.renderQueue.equipment = true;
                        }
                    });
                })
            }
            this.makeUpgrades(item)
        });
        game.combat.computeAllStats();
    }

    onInterfaceAvailable() {
        
    }

    removeGizmo(item) {
        if(!(item instanceof InventionGizmo))
            return;
        if(item instanceof InventionGizmo) {
            if(this.checkForGizmo(item))
                return;
            this.game.stats.Items.statsMap.delete(item);
            this.game.bank.glowingItems.delete(item);
            let sortIdx = this.game.bank.customSortOrder.indexOf(item);
            if(sortIdx > -1)
                this.game.bank.customSortOrder.splice(this.game.bank.customSortOrder.indexOf(item), 1);
            console.log("Removed Gizmo:", item.id, item.description);
            this.gizmos.registeredObjects.delete(item.id);
        }
    }

    getPerkTypeFromGizmo(item) {
        let type;
        if(item !== undefined && item.id === 'invention:Weapon_Gizmo')
            type = 'weapon';
        if(item !== undefined && item.id === 'invention:Armour_Gizmo')
            type = 'armour';
        return type;
    }

    createGizmo(item, components=[]) {
        let type = this.getPerkTypeFromGizmo(item);
        if(type === undefined)
            return;
        let gizmoPerks = new Map();
        let { budget, perks, chosen } = this.generatePerks(type, components);
        if(chosen.length === 0)
            return { budget, perks, chosen };
        
        chosen.forEach(gen => {
            gizmoPerks.set(gen.perk, gen.rank);
        });

        let gizmo = new InventionGizmo({item}, this, this.game);
        gizmo.setPerks(gizmoPerks);
        this.gizmos.registerObject(gizmo);
        this.game.items.registerObject(gizmo);
        console.log("Created Gizmo:", gizmo.id, gizmo.description);
        return { budget, perks, chosen, gizmo };
    }

    rewardForDamage(damage) {
        damage = damage / numberMultiplier;
        let items = [...game.combat.player.equipment.itemSlotMap.keys()];
        items.forEach(item => {
            if(item instanceof InventionAugmentedWeaponItem) {
                if(item.occupiesSlots.includes('Shield')) {
                    item.addXP(damage * 0.06);
                } else {
                    item.addXP(damage * 0.04);
                }
            } else if (item instanceof InventionAugmentedEquipmentItem) {
                let validSlots = item.validSlots.map(slot => slot._localID);
                if(validSlots.includes('Shield')) {
                    item.addXP(damage * 0.02);
                } else {
                    item.addXP(damage * 0.04);
                }
            }
        });
    }

    canDisassemble(item) {
        if(this.isAugmentedItem(item))
            item = item.item;
        return item !== undefined && item.canDisassemble;
    }

    getItemLevel(item) {
        let level = 1;
        if(this.isAugmentedItem(item))
            item = item.item;

        if(item instanceof EquipmentItem) {
            level = item.equipRequirements.reduce((highest, current) => {
                return current.type === "SkillLevel" && current.level > highest ? current.level : highest;
            }, 1);

            if(level === 1 && (item.type === "Ring" || item.type === "Amulet")) {
                let action = game.crafting.actions.find(action => action.product === item);
                if(action !== undefined)
                    level = action.level;
            }

            if(level === 1 && item.category === "Summoning" && item.type === "Familiar") {
                let action = game.summoning.actions.find(action => action.product === item);
                if(action !== undefined)
                    level = action.level;
            }

            if(level === 1 && item.equipRequirements.filter(req => req.type === 'SkillLevel' && req.skill !== game.altMagic).length === 0) {
                if(item.sellsFor >= 150)
                    level = 10;
                if(item.sellsFor >= 10000)
                    level = 25;
                if(item.sellsFor >= 10000)
                    level = 40;
                if(item.sellsFor >= 20000)
                    level = 60;
                if(item.sellsFor >= 100000)
                    level = 70;
                if(item.sellsFor >= 300000)
                    level = 85;
                if(item.sellsFor >= 1000000)
                    level = 99;
            }
        } else {
            let action;
            switch (item.category) {
                case "Gemstone":
                    switch(item.id) {
                        case "melvorD:Topaz":
                            level = 10;
                            break;
                        case "melvorD:Sapphire":
                            level = 20;
                            break;
                        case "melvorD:Ruby":
                            level = 25;
                            break;
                        case "melvorD:Emerald":
                            level = 50;
                            break;
                        case "melvorD:Diamond":
                            level = 80;
                            break;
                        case "melvorF:Jadestone":
                            level = 95;
                            break;
                        case "melvorTotH:Onyx":
                        case "melvorTotH:Oricha":
                        case "melvorTotH:Cerulean":
                        case "melvorTotH:Zephyte":
                        case "melvorTotH:Runestone":
                            level = 99;
                            break;
                    }
                    break;
                case "Misc":
                    if(item.type === "Bones") {
                        switch(item.id) {
                            case "melvorD:Bones": // 1 PP
                                level = 10;
                                break;
                            case "melvorD:Big_Bones": // 3 PP
                            case "melvorF:Holy_Dust":
                                level = 30;
                                break;
                            case "melvorD:Dragon_Bones": // 5 PP
                                level = 50;
                                break;
                            case "melvorD:Magic_Bones": // 10 PP
                                level = 75;
                                break;
                            case "melvorTotH:Infernal_Bones": // 14 PP
                                level = 99;
                                break;
                        }
                    }
                    break;
                case "Woodcutting":
                    action = game.woodcutting.actions.find(action => action.product === item);
                    if(action !== undefined)
                        level = action.level;
                    break;
                case "Fishing":
                    action = game.fishing.actions.find(action => action.product === item);
                    if(action !== undefined)
                        level = action.level;
                    break;
                case "Cooking":
                    action = game.cooking.actions.find(action => action.product === item || action.perfectItem === item);
                    if(action !== undefined)
                        level = action.level;
                    break;
                case "Mining":
                    action = game.mining.actions.find(action => action.product === item);
                    if(action !== undefined)
                        level = action.level;
                    break;
                case "Smithing":
                    action = game.smithing.actions.find(action => action.product === item);
                    if(action !== undefined)
                        level = action.level;
                    break;
                case "Farming":
                    action = game.farming.actions.find(action => action.product === item || action.seedCost.item === item);
                    if(action !== undefined)
                        level = action.level;
                    break;
                case "Fletching":
                    action = game.fletching.actions.find(action => action.product === item);
                    if(action !== undefined)
                        level = action.level;
                    break;
                case "Crafting":
                    action = game.crafting.actions.find(action => action.product === item);
                    if(action !== undefined)
                        level = action.level;
                    break;
                case "Runecrafting":
                    action = game.runecrafting.actions.find(action => action.product === item);
                    if(action !== undefined)
                        level = action.level;
                    break;
                case "Firemaking":
                    action = game.firemaking.actions.find(action => action.product === item);
                    if(action !== undefined)
                        level = action.level;
                    break;
                case "Thieving":
                    action = game.thieving.actions.find(action => action.product === item);
                    if(action !== undefined)
                        level = action.level;
                    break;
                case "Herblore":
                    action = game.herblore.actions.find(action => action.potions.includes(item));
                    if(action !== undefined)
                        level = action.level;
                    break;
                case "Summoning":
                    action = game.summoning.actions.find(action => action.product === item);
                    if(action !== undefined)
                        level = action.level;
                    break;
                case "Astrology":
                    action = game.astrology.actions.find(action => action.product === item);
                    if(action !== undefined)
                        level = action.level;
                    break;
                default:
                    break;
            }
        }
        return level;
    }

    getJunkChanceForItem(item) {
        if(this.isAugmentedItem(item))
            item = item.item;

        let chance = 99;
        let ilvl = this.getItemLevel(item)
        if(ilvl < 75) {
            chance = 100 - (1.1 * ilvl);
        } else if (ilvl >= 75 && ilvl < 90) {
            chance = 99.1 - (2.089 * ilvl) + (1.1 * Math.pow(ilvl/10, 2));
        } else {
            chance = 0;
        }

        let reduction = 1;
        if(this.hasResearched('invention:Junk1'))
            reduction = 0.99;
        if(this.hasResearched('invention:Junk2'))
            reduction = 0.97;
        if(this.hasResearched('invention:Junk3'))
            reduction = 0.95;
        if(this.hasResearched('invention:Junk4'))
            reduction = 0.93;
        if(this.hasResearched('invention:Junk5'))
            reduction = 0.91;
        if(this.hasResearched('invention:Junk6'))
            reduction = 0.88;
        if(this.hasResearched('invention:Junk7'))
            reduction = 0.86;
        if(this.hasResearched('invention:Junk8'))
            reduction = 0.83;

        return chance * reduction;
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

    getShellFromProduct(item) {
        if(item.id === 'invention:Weapon_Gizmo')
            return this.game.items.getObjectByID('invention:Weapon_Gizmo_Shell')
        if(item.id === 'invention:Armour_Gizmo')
            return this.game.items.getObjectByID('invention:Armour_Gizmo_Shell')
    }

    possiblePerks(type="weapon", materials=[]) {
        let perks = new Map();
        materials.forEach(material => {
            if(material.perks[type])
                material.perks[type].forEach(perkValue => {
                    let perk = this.perks.getObjectByID(perkValue.perkID);
                    let { high=0, low=0, roll=0 } = perks.get(perk) || {};
                    low += perkValue.base;
                    high += perkValue.base + perkValue.roll;
                    roll += perkValue.base + rollInteger(0, perkValue.roll);

                    perks.set(perk, {high, low, roll});
                });
        });
        let ranks = [...perks.entries()].map(([perk, {low, high, roll}]) => {
            let rollRank, lowRank, highRank;
            for(let i = 0; i < perk.ranks.length; i++) {
                if(roll >= perk.ranks[i].cost)
                    rollRank = perk.ranks[i];
                if(low >= perk.ranks[i].cost)
                    lowRank = perk.ranks[i];
                if(high >= perk.ranks[i].cost)
                    highRank = perk.ranks[i];
            }
            return { perk, low, lowRank, high, highRank, roll, rollRank };
        })
        if(ranks.length > 1)
            //ranks.sort((a, b) => a.value - b.value);
            this.perksort(0, ranks.length-1, ranks, (a, b) => b.roll - a.roll);
        return ranks;
    }

    getBudget(roll=true) {
        let [ low, high, budget ] = [this.level, (Math.floor(this.level / 2) + 20) * 5, 0];
        if(roll) {
            for(let i = 0; i < 5; i++)
                budget += rollInteger(0, Math.floor(this.level / 2) + 20);
            budget = Math.max(budget, this.level);
        }
        return { low, high, budget };
    }

    generatePerks(type="weapon", materials=[]) {
        let { budget } = this.getBudget();
        let rolledBudget = budget;

        let perks = this.possiblePerks(type, materials);
        
        let chosen = [];
        for(let i = 0; i < perks.length-1; i++) {
            if(perks[i].rollRank !== undefined && perks[i].rollRank.cost <= rolledBudget) {
                chosen.push({ perk: perks[i].perk, rank: perks[i].rollRank.rank, roll: perks[i].roll });
                rolledBudget -= perks[i].rollRank.cost;
                if(chosen.length === 2)
                    break;
            }
        }
        return { budget, perks, chosen };
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

    onLoad() {
        console.log("Invention onLoad");
        super.onLoad();

        this.overview.onLoad();
        this.pages.onLoad();
        
        this.discover.go();
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

        this.game.scheduleSave();
        return true;
    }

    stop() {
        if(!this.canStop)
            return false;

        let ret = this.pages.stop();
            
        this.isActive = false;
        this.game.renderQueue.activeSkills = true;
        this.game.clearActiveAction(false);

        this.game.scheduleSave();
        return ret;
    }

    getErrorLog() {
        return `Is Active: ${this.isActive}\n`;
    }

    activeTick() {
        this.pages.activeTick();
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


        console.log("Loading Discoveries");
        data.discoveries.forEach(data => {
            let discovery = new InventionDiscovery(namespace, data, this, this.game);
            this.discoveries.registerObject(discovery);
        });

        console.log("Loading Perks");
        data.perks.forEach(data => {
            if(data.combatEffect !== undefined) {
                if(Array.isArray(data.combatEffect)) {
                    game.registerCombatEffects(namespace, data.combatEffect.filter(effect => effect.id !== undefined));
                } else {
                    if(data.combatEffect.id !== undefined) {
                        game.registerCombatEffects(namespace, data.ranks.map(({rank}) => {
                            let newEffect = { ...data.combatEffect };
                            newEffect.id = `${data.combatEffect.id}_${rank}`;
                            if(data.combatEffect.statGroups !== undefined) {
                                newEffect.statGroups = data.combatEffect.statGroups.map(group => {
                                    let newGroup = { ...group };
                                    if(group.modifiers !== undefined) {
                                        newGroup.modifiers = Object.fromEntries(Object.entries(group.modifiers).map(([mod, modValue]) => {
                                            if(Array.isArray(modValue)) {
                                                return [mod, modValue.map(scope => {
                                                    let newScope = { ...scope };
                                                    if(scope.value !== undefined)
                                                        newScope.value = scope.value * rank;
                                                    return newScope;
                                                })];
                                            } else {
                                                return [mod, modValue * rank];
                                            }
                                        }));
                                    }
                                    if(group.combatEffects !== undefined) {
                                        // Scale Combat Effects?
                                    }
                                    return newGroup;
                                })
                            }
                            return newEffect;
                        }));
                    }
                }
            }

            let perk = new InventionPerk(namespace, data, this, this.game);
            this.perks.registerObject(perk);
        });

        console.log("Loading Parts");
        data.components.forEach(data => {
            let component = new InventionComponentItem(namespace, data, this, this.game);
            this.components.registerObject(component);
            this.game.items.registerObject(component);
        });

        console.log("Loading Items");
        this.game.registerItemData(namespace, data.items);

        console.log("Loading Workbench");
        data.workbench.forEach(data => {
            let action = new InventionWorkbenchRecipe(namespace, data, this, this.game);
            this.workbench.actions.registerObject(action);
        });

        console.log("Loading Categories");
        data.disassemble_categories.forEach(data => {
            if(data.items !== undefined) {
                data.items.forEach(item => {
                    let table = new MaterialsDropTable(game, data.parts, item.count !== undefined ? item.count : data.count, item.requires !== undefined ? item.requires : data.requires);
                    this.cachedDropTables.set(item.id, table);
                });
            }
        });

        this.data = data;
    }

    postDataRegistration() {
        console.log("Invention postDataRegistration");
        super.postDataRegistration(); // Milestones setLevel

        this.pages.postDataRegistration();

        [...this.cachedDropTables.keys()].forEach(id => {
            let item = game.items.getObjectByID(id);
            if(item !== undefined)
                item.canDisassemble = true;
        });
    }

    encode(writer) {
        let start = writer.byteOffset;
        super.encode(writer); // Encode default skill data
        writer.writeUint32(this.version); // Store current skill version
        writer.writeBoolean(this.isActive);
        
        writer.writeArray(this.gizmos.allObjects.filter((gizmo) => this.checkForGizmo(gizmo)), (value, writer) => {
            writer.writeNamespacedObject(value);
            value.encode(writer);
        });
        writer.writeArray(this.weapons.allObjects.filter((item) => this.checkForItem(item)), (value, writer) => {
            writer.writeNamespacedObject(value);
            value.encode(writer);
        });
        writer.writeArray(this.armour.allObjects.filter((item) => this.checkForItem(item)), (value, writer) => {
            writer.writeNamespacedObject(value);
            value.encode(writer);
        });

        writer.writeComplexMap(this.researched, (key, value, writer) => {
            writer.writeNamespacedObject(key);
            writer.writeBoolean(value);
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

            console.log("Decoding Gizmos");
            reader.getArray((reader) => {
                let value = reader.getNamespacedObject(this.gizmos);
                console.log(`Got ${value.id}, decoding`);
                value.decode(reader);
                return value;
            });
            console.log("Decoding Weapons");
            reader.getArray((reader) => {
                let value = reader.getNamespacedObject(this.weapons);
                console.log(`Got ${value.id}, decoding`);
                value.decode(reader);
                return value;
            });
            console.log("Decoding Armour");
            reader.getArray((reader) => {
                let value = reader.getNamespacedObject(this.armour);
                console.log(`Got ${value.id}, decoding`);
                value.decode(reader);
                return value;
            });

            this.researched = reader.getComplexMap((reader) => {
                let key = reader.getNamespacedObject(this.discoveries);
                let value = reader.getBoolean();
                return { key, value }
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

