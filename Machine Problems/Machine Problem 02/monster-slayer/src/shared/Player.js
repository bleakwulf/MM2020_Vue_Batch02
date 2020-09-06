import { PlayerStats, SkillNatureType } from './Skill.js';

export default class Player {
    constructor(
        pov = 1,
        name = 'You', 
        character
    ) {
        this.pov = pov;
        this.name = name;
        this.character = character;
        this.hpLevel = character.maxHP;
        this.mpLevel = character.maxMP;
    }

    useRandomSkill() {
        const eligibleSkills = this.character.skills.filter(skill => Math.abs(skill.mpCost <= this.mpLevel));

        const availableSkills = eligibleSkills.filter(skill => skill.statCheck === null 
            || (skill.statCheck === PlayerStats.HP && this.hpLevel < this.character.maxHP)
            || (skill.level !== 0 && skill.statCheck === PlayerStats.MP && this.mpLevel > Math.abs(skill.mpCost))
            || (skill.level === 0 && skill.statCheck === PlayerStats.MP && this.mpLevel < this.character.maxMP)
        );

        return availableSkills[Math.ceil(Math.random() * 10) % availableSkills.length];
    }
}