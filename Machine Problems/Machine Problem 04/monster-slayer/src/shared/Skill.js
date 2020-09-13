export class Skill {
    constructor(
        name,
        description = '', 
        level = 0, 
        nature = 'OO', 
        hpDamage = 0, 
        mpDamage = 0, 
        hpCost, 
        mpCost, 
        statCheck = null
    ) {
        this.name = name;
        this.description = description;
        this.level = level;
        this.nature = nature;
        this.hpDamage = hpDamage;
        this.mpDamage = mpDamage;
        this.mpCost = mpCost;
        this.hpCost = hpCost;
        this.statCheck = statCheck;
    }
}

export const SkillNatureType = {
    OFFENSE: 'OO', 
    NEUTRAL: 'NN', 
    SPECIAL: 'SS'
}