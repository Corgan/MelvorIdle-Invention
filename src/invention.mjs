const { loadModule } = mod.getContext(import.meta);


const { InventionPageUIComponent } = await loadModule('src/components/invention.mjs');

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

        this.component = new InventionPageUIComponent(this, this.game);

        console.log("Invention constructor done");
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
        game.combat.player.equipItem(game.items.getObjectByID('invention:Augmented_Weapon_Placeholder'), 0, 'Weapon', 1);
        game.combat.player.equipItem(game.items.getObjectByID('invention:Augmented_Equipment_Placeholder'), 0, 'Platebody', 1);
        game.combat.player.equipItem(game.items.getObjectByID('invention:Augmented_Equipment_Placeholder'), 0, 'Platelegs', 1);
    */

    onLoad() {
        console.log("Invention onLoad");
        super.onLoad();
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
        super.registerData(namespace, data); // pets, rareDrops, minibar, customMilestones
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

        let end = writer.byteOffset;
        //console.log(`Wrote ${end-start} bytes for Invention save`);
        return writer;
    }

    decode(reader, version) {
        //console.log("Invention save decoding");
        let start = reader.byteOffset;
        reader.byteOffset -= Uint32Array.BYTES_PER_ELEMENT; // Let's back up a minute and get the size of our skill data
        let skillDataSize = reader.getUint32();

        try {
            super.decode(reader, version);
            this.saveVersion = reader.getUint32(); // Read save version
            if(this.saveVersion < this.version)
                throw new Error("Old Save Version");
            this.isActive = reader.getBoolean();
        } catch(e) { // Something's fucky, dump all progress and skip past the trash save data
            console.log(e);
            reader.byteOffset = start;
            reader.getFixedLengthBuffer(skillDataSize);
        }

        let end = reader.byteOffset;
        //console.log(`Read ${end-start} bytes for Invention save`);
    }
}

