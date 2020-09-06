import { Skill, SkillNatureType, PlayerStats }  from "./Skill.js";

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