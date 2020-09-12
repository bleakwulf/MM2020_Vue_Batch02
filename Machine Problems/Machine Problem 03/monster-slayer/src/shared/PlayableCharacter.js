import { Skill, SkillNatureType }  from "./Skill.js";

export const CharacterClass = {
    SABER:      1,
    ARCHER:     2, 
    LANCER:     3, 
    BERSERKER:  4, 
    CASTER:     5 
}

export const PlayerStats = {
    HP: 'HP',
    MP: 'MP'
}

export class PlayableCharacter {
    constructor(
        name, 
        characterClass = null, 
        maxHP = 100,
        maxMP = 100,
        skills = []
    ) {
        this.name = name;
        this.characterClass = characterClass;
        this.maxHP = maxHP;
        this.maxMP = maxMP;
        this.skills = [
            new Skill(
                'Attack',
                'Launch basic attack on opponent',
                0, 
                SkillNatureType.OFFENSE, 
                10, 
                0, 
                0, 
                0
            ),
            new Skill(       
                'Focus',
                'Meditate to gain mana',
                0, 
                SkillNatureType.NEUTRAL, 
                0, 
                0, 
                0, 
                20, 
                PlayerStats.MP
            ),
            ...skills
        ];
    }
}

export class BaseCharacter extends PlayableCharacter {
    constructor(name) {
        super(
            name, 
            null,
            150, 
            500, 
            [
                new Skill(
                    'Heavy Slash', 
                    'Launches powered slash against opponent',
                    1, 
                    SkillNatureType.OFFENSE, 
                    45,
                    0, 
                    0, 
                    -45
                ),
                new Skill(
                    'Crush', 
                    'Crushes opponent with combined powers from mana and gravity',
                    1, 
                    SkillNatureType.OFFENSE, 
                    50,
                    0, 
                    0, 
                    -50
                ),
                new Skill(
                    'Heal', 
                    'Regain health using own mana',
                    1, 
                    SkillNatureType.NEUTRAL, 
                    0, 
                    0, 
                    50,
                    -60,
                    PlayerStats.HP
                ) 

            ]
        );
    }
}

export class Goblin extends PlayableCharacter {
    constructor(name) {
        super(
            'Goblin', 
            null,
            250, 
            400, 
            [
                new Skill(
                    'Outburst', 
                    'Vicious physical blow from mana-induced brawn',
                    1, 
                    SkillNatureType.OFFENSE, 
                    30,
                    0, 
                    0, 
                    -35
                ),
                new Skill(
                    'Axe Smite', 
                    'Slash using powered melee weapon.',
                    1, 
                    SkillNatureType.OFFENSE, 
                    40,
                    0, 
                    0, 
                    -45
                ),
                new Skill(
                    'Drain', 
                    'Siphons life force and mana from the enemy to replenish own health and mana',
                    1, 
                    SkillNatureType.SPECIAL, 
                    40,
                    45, 
                    40, 
                    -75+45
                )
            ]
        );
    }
} 

export class Saber extends PlayableCharacter {
    constructor(name) {
        super(
            name, 
            CharacterClass.SABER, 
            350, 
            450, 
            [
                new Skill(
                    'Wing Air', 
                    'An upward slash. Knocks the opponent up', 
                    1, 
                    SkillNatureType.OFFENSE, 
                    90,
                    0, 
                    0, 
                    -30,
                    null
                ), 
                new Skill(
                    'Strike Air', 
                    'Strike Air: Hammer of the Wind King - Creates a cyclone from a swing', 
                    1, 
                    SkillNatureType.OFFENSE, 
                    95,
                    0, 
                    0, 
                    -35,
                    null
                ), 
                new Skill(
                    'Excalibur', 
                    'Excalibur: Sword of Promised Victory - Attacks with a light sword', 
                    1, 
                    SkillNatureType.OFFENSE, 
                    100,
                    0, 
                    0, 
                    -40,
                    null
                )
            ]
        )
    }
}

export class Archer extends PlayableCharacter {
    constructor(name) {
        super(
            name, 
            CharacterClass.ARCHER, 
            300, 
            350, 
            [
                new Skill(
                    'Kakuyoku Niren', 
                    'Archer throws his blades to attack', 
                    1, 
                    SkillNatureType.OFFENSE, 
                    80,
                    0, 
                    0, 
                    -10,
                    null
                ), 
                new Skill(
                    'Blade Dance', 
                    'A falling blades shot', 
                    1, 
                    SkillNatureType.OFFENSE, 
                    75,
                    0, 
                    0, 
                    -15,
                    null
                ), 
                new Skill(
                    'Caladbolg II', 
                    'Caladbolg II: The Fake Spiral Sword - A downward shot', 
                    1, 
                    SkillNatureType.OFFENSE, 
                    120,
                    0, 
                    0, 
                    -30,
                    null
                )
            ]
        )
    }
}

export class Lancer extends PlayableCharacter {
    constructor(name) {
        super(
            name, 
            CharacterClass.LANCER, 
            300, 
            400, 
            [
                new Skill(
                    'Red Branch/Eihwaz', 
                    'Archer throws his blades to attack', 
                    1, 
                    SkillNatureType.OFFENSE, 
                    65,
                    0, 
                    0, 
                    -15,
                    null
                ), 
                new Skill(
                    'Gae Bulg I', 
                    'Gae Bulg: Barbed Spear that Pierces with Death - A powerful piercing thrust', 
                    1, 
                    SkillNatureType.OFFENSE, 
                    70,
                    0, 
                    0, 
                    -15,
                    null
                ), 
                new Skill(
                    'Gae Bulg II', 
                    'Gae Bulg: Soaring Spear that Strikes with Death - A downward launching spear', 
                    1, 
                    SkillNatureType.OFFENSE, 
                    110,
                    0, 
                    0, 
                    -35,
                    null
                )
            ]
        )
    }
}

export class Berserker extends PlayableCharacter {
    constructor(name) {
        super(
            name, 
            CharacterClass.BERSERKER, 
            450, 
            300, 
            [
                new Skill(
                    'Augeas', 
                    'Augeas the Earth Shatterer - Creates a ground wave with a downward chop', 
                    1, 
                    SkillNatureType.OFFENSE, 
                    70,
                    0, 
                    0, 
                    -45,
                    null
                ), 
                new Skill(
                    'Gigantomachia', 
                    'Gigantomachia: Blow from the Gods - A charged downward chop', 
                    1, 
                    SkillNatureType.OFFENSE, 
                    100,
                    0, 
                    0, 
                    -60,
                    null
                ), 
                new Skill(
                    'Nine Lives', 
                    'Nine Lives: One Hundred Arrow Strikes - a high speed attack consisting of nine consecutive strikes, as swift as if the attacks are overlapping', 
                    1, 
                    SkillNatureType.OFFENSE, 
                    150,
                    0, 
                    0, 
                    -80,
                    null
                )
            ]
        )
    }
}

export class Caster extends PlayableCharacter {
    constructor(name) {
        super(
            name, 
            CharacterClass.CASTER, 
            400, 
            800, 
            [
                new Skill(
                    'Corycian', 
                    'Creates a moving forward energy sphere', 
                    1, 
                    SkillNatureType.OFFENSE, 
                    70,
                    0, 
                    0, 
                    -25,
                    null
                ), 
                new Skill(
                    'Hecate Gaeae', 
                    'Locks the opponent with the magic platform, then attack', 
                    1, 
                    SkillNatureType.OFFENSE, 
                    100,
                    0, 
                    0, 
                    -30,
                    null
                ), 
                new Skill(
                    'Hecate Gaeae EX', 
                    'A more destructive version of Hecate Gaeae', 
                    1, 
                    SkillNatureType.OFFENSE, 
                    175,
                    0, 
                    0, 
                    -35,
                    null
                )
            ]
        )
    }
}


