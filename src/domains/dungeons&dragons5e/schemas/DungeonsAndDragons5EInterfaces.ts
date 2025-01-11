// Armor entity
export interface Cost {
    value: number;
    currency: string;
}

export interface Armor {
    type: string;
    name: string;
    description: string;
    cost: Cost;
    weight: number;
    armorClass: number;
    requiredStrength: number;
    stealthPenalty: boolean;
}

// Background entity
export interface Suggested {
    personalityTrait: string[];
    ideal: string[];
    bond: string[];
    flaw: string[];
}

export interface Characteristics {
    name: string;
    description: string;
    suggested: Suggested;
}

export interface Background {
    name: string;
    description: string;
    skillProficiencies: string[];
    languages: string[];
    equipment: string[];
    characteristics: Characteristics;
}

// Class entity
export interface HitPoints {
    hitDice: string;
    hitPointsAtFirstLevel: string;
    hitPointsAtHigherLevels: string;
}

export interface Proficiencies {
    armor: string[];
    weapons: string[];
    tools: string[];
    savingThrows: string[];
    skills: string[];
}

export interface Equipment {
    a: string;
    b: string;
}

export interface CantripsKnown {
    isValidToThisClass: boolean;
    amount: number[];
}

export interface SpellSlotsPerSpellLevel {
    isValidToThisClass: boolean;
    spellLevel: number[];
    spellSpaces: number[];
}

export interface SpellsKnown {
    isValidToThisClass: boolean;
    amount: number[];
}

export interface KiPoints {
    isValidToThisClass: boolean;
    amount: number[];
}

export interface MartialArts {
    isValidToThisClass: boolean;
    amount: number[];
}

export interface UnarmoredMovement {
    isValidToThisClass: boolean;
    amount: number[];
}

export interface SneakAttack {
    isValidToThisClass: boolean;
    amount: number[];
}

export interface SorceryPoints {
    isValidToThisClass: boolean;
    amount: number[];
}

export interface InvocationsKnown {
    isValidToThisClass: boolean;
    amount: number[];
}

export interface Rages {
    isValidToThisClass: boolean;
    amount: number[];
}

export interface RageDamage {
    isValidToThisClass: boolean;
    amount: number[];
}

export interface LevelingSpecs {
    level: number[];
    proficiencyBonus: number[];
    features: string[];
    cantripsKnown: CantripsKnown;
    spellSlotsPerSpellLevel: SpellSlotsPerSpellLevel;
    spellsKnown: SpellsKnown;
    kiPoints: KiPoints;
    martialArts: MartialArts;
    unarmoredMovement: UnarmoredMovement;
    sneakAttack: SneakAttack;
    sorceryPoints: SorceryPoints;
    invocationsKnown: InvocationsKnown;
    rages: Rages;
    rageDamage: RageDamage;
}

export interface ClassCharacteristics {
    title: string;
    description: string;
}

export interface SubClass {
    title: string;
    description: string;
    characteristics: ClassCharacteristics[];
}

export interface Class {
    name: string;
    description: string;
    hitPoints: HitPoints;
    proficiencies: Proficiencies;
    equipment: Equipment[];
    levelingSpecs: LevelingSpecs;
    characteristics: ClassCharacteristics[];
    subClass: SubClass[];
}

// Feat entity
export interface Feat {
    name: string;
    prerequisite: string;
    description: string;
    benefits: string[];
}

// God entity
export interface God {
    name: string;
    alignment: string;
    suggestedDomains: string;
    symbol: string;
    pantheon: string;
}

// Item entity
export interface TradeGoods {
    isValid: boolean;
    goods: string;
}

export interface MountOrVehicle {
    isValid: boolean;
    speed: string;
    carryingCapacity: string;
}

export interface Item {
    name: string;
    description: string;
    cost: Cost;
    type: string;
    weight: number;
    mountOrVehicle: MountOrVehicle;
    tradeGoods: TradeGoods;
}

// MagicIem entity
export interface MagicItem {
    name: string;
    characteristics: string[];
    description: string;
}

// Monster entity
export interface HitPointsStats {
    hitDice: string;
    default: number;
}

export interface SavingThrow {
    name: string;
    value: number;
}

export interface Stats {
    armorClass: number;
    hitPoints: HitPointsStats;
    speed: string;
    savingThrows: SavingThrow[];
    damageImmunities: string[];
    conditionImmunities: string[];
    damageResistances: string[];
    senses: string[];
    languages: string[];
    challengeLevel: number;
}

export interface AbilityScore {
    name: string;
    value: number;
    modifier: number;
}

export interface Skill {
    name: string;
    description: string;
}

export interface Action {
    name: string;
    description: string;
    type: string;
}

export interface Monster {
    name: string;
    characteristics: string[];
    stats: Stats;
    abilityScore: AbilityScore[];
    skills: Skill[];
    actions: Action[];
    picture: string;
}

// Race entity
export interface AbilityScoreIncrease {
    name: string;
    value: number;
}

export interface SubRaceCharacteristics {
    name: string;
    description: string;
}

export interface SubRace {
    name: string;
    description: string;
    abilityScoreIncrease: AbilityScoreIncrease[];
    characteristics: SubRaceCharacteristics[];
}

export interface Race {
    name: string;
    description: string;
    size: string;
    tale: string;
    abilityScoreIncrease: AbilityScoreIncrease[];
    ageMax: number;
    alignment: string[];
    heightMax: number;
    speed: [number, string];
    language: string[];
    subRaces: SubRace[];
    skillProficiencies: string[];
    characteristics: Characteristics[];
    weightMax: number;
}

// Realm entity
export interface Realm {
    name: string;
    description: string;
    thumbnail: string;
}

// Spell entity
export interface Damage {
    type: string;
    dice: string;
}

export interface HigherLevels {
    level: string;
    damage: Damage[];
    buffs: string[];
    debuffs: string[];
}

export interface Spell {
    name: string;
    description: string;
    type: string;
    level: number;
    higherLevels: HigherLevels[];
    damage: Damage[] | null;
    castingTime: string;
    duration: string;
    range: string;
    components: string;
    buffs: string[];
    debuffs: string[];
}

// System entity
export interface SystemReferences {
    srd: string;
    icon: string;
    cover: string;
}

export interface SystemContent {
    races: string[];
    classes: string[];
    spells: string[];
    items: string[];
    weapons: string[];
    armors: string[];
    feats: string[];
    realms: string[];
    gods: string[];
    monsters: string[];
}

export interface System {
    name: string;
    content: SystemContent;
    references: SystemReferences;
    active: boolean;
}

export interface SystemPayload {
    name: string;
    references: SystemReferences;
    active: boolean;
}

// Weapon entity
export interface Weapon {
    name: string;
    description: string;
    cost: Cost;
    type: string;
    weight: number;
    damage: string;
    properties: string[];
}

// Wiki entity
export interface SubTopic {
    subTitle: string;
    description: string;
}

export interface Wiki {
    title: string;
    description: string;
    reference: string;
    image: string;
    subTopics: SubTopic[];
}
