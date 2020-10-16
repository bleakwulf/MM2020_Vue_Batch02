<template>
    <div class="character-controls"
        :class="{ 
                'p1' : pov === 1, 
                'p2' : pov === 2, 
            }">
        <div v-for="skill in skills"
            :key="skill._id"
            class="character-action"             
            :class="{
                'isBrawnSkill' : skill.type === 'P', 
                'isMagicSkill' : skill.type === 'M', 
                'isDisabled' : !isEnabledSkill(skill), 
            }">
            <button :disabled="!isEnabledSkill(skill)"
                @click="wieldSkill(skill)"
                v-if="pov === 1">
                {{ skill.name }}
            </button> 
            <div v-if="pov !== 1">
                {{ skill.name }}
            </div>
        </div>
        <div class="character-action" v-if="pov === 1">
            <button @click.prevent="quitMatch()">
                Run Away
            </button> 
        </div>
    </div>
  
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {

    props: {
        pov: {
            type: Number,
            required: true
        }
    }, 

    methods: {
        ...mapActions([ 
            'enterDungeon', 
            'processSkillMove'
        ]), 

        isGoodStatCheck(skill) {
            return skill.target === 'enemy' ? true 
                : skill._id === `P${this.pov}__FOCUS` ? this.stats.mana < this.stats.maxMp 
                : this.stats.health < this.stats.maxHp;
        }, 

        isEnabledSkill(skill) {
            return this.availableSkills
                        .map( availSkills => availSkills._id )
                        .includes(skill._id);
        },

        showSkillWarning(skill) {
            return this.isEnabledSkill(skill) ? '' 
                        : skill.cost > this.stats.mana ? `Can't wield this skill due insufficient mana`
                        : skill._id === `P${this.pov}__FOCUS` ? `Your mana is already fully replenished`
                        : `Your health is already fully recovered`
        }, 

        async quitMatch() {
            const confirmReentry = confirm('Would you like to re-enter this dungeon?');
            if (confirmReentry) {
                await this.enterDungeon({ dungeonId: this.dungeon._id })
                    .then( res => 
                        console.log(`new game`)
                        // this.$router.push('/game/encounter') 
                    );
            } else {
                this.$router.push('/game/profile');
            }
        }, 

        async wieldSkill(skill) {
            await this.processSkillMove({
                povSource: this.pov, 
                skillWielded: skill
            });
        }, 

        async executeRandomSkill() {
            setTimeout( async() => {
                // pseudo AI, use random skill from available skills ONLY
                const randomEnemySkill = this.availableSkills[Math.ceil(Math.random() * 10) % this.availableSkills.length];

                await this.processSkillMove({
                    povSource: this.pov, 
                    skillWielded: randomEnemySkill
                });
            }, 5000);
        }
    }, 

    computed: {
        ...mapGetters([ 'getMatchData' ]), 

        profile: function() {
            return this.pov === 1 ? this.getMatchData.p1 : this.getMatchData.p2;
        }, 

        dungeon: function() {
            return this.getMatchData.dungeon;
        }, 
        
        stats: function() {
            return this.pov === 1 ? this.getMatchData.p1.stats : this.getMatchData.p2.stats;
        }, 

        povTurn: function() {
            return this.getMatchData.povTurn;
        },

        baseSkills: function() {
            return [
                {
                    _id: `P${this.pov}__ATTACK`,
                    name: 'Attack',
                    damage: 10,
                    target: 'enemy',
                    cost: 0,
                    type: 'P'
                }, 
                {
                    _id: `P${this.pov}__FOCUS`,
                    name: 'Focus',
                    damage: -75,
                    target: 'self',
                    cost: 0,
                    type: 'M'
                }
            ];
        }, 

        skills: function() {
            return [ ...this.baseSkills, ...this.profile.skills ];
        }, 

        availableSkills: function() {
            const availableSkills = this.skills.filter( skill => {
                return ( skill.type === 'P' && this.isGoodStatCheck(skill) )
                    || ( skill.type === 'M' && Math.abs(skill.cost) <= this.stats.mana && this.isGoodStatCheck(skill) )
            });

            return availableSkills;
        }
    }, 

    watch: {
        povTurn: async function(newPovTurn, oldPovTurn) {
            if( oldPovTurn !== newPovTurn && newPovTurn === this.pov && this.pov === 2) { 
                this.executeRandomSkill();
            }

        }
    }


}
</script>

<style>
    .character-controls {
        position: absolute;
    }
    
    .character-controls.p1 {
        left: -75px;
    }
    
    .character-controls.p2 {
        right: -70px;
    }

    .character-action {
        width: 180px;
        margin-bottom: 10px;
        position: relative;
        z-index: 0;
    }

    .character-action > button, 
    .character-action > div {
        width: 100%;
        background: transparent;
        border: none;
        font-size: 12px;
        line-height: 1.5rem;
        z-index: 1;
        text-align: center;
    }

    .character-action > button:focus {
        outline: none;
        text-decoration: none;
    }
    
    .character-action::before,
    .character-action::after {
        width: 100%;
        left: 0;
        height: 12px;
        z-index: -1;
        border: 2px solid 0000f5;
        background: #7a7aff;
    }
    
    .character-action::before {
        position: absolute;
        content: '';
        transform: perspective(10px) rotateX(3deg);
        border-bottom: none !important;
    }
    
    .character-action::after {
        position: absolute;
        top: 12px;
        content: '';
        transform: perspective(10px) rotateX(-3deg);
        border-top: none !important;
    } 
    
    .character-action.isBrawnSkill::before,
    .character-action.isBrawnSkill::after {
        border: 2px solid #f59f00;
        background: #ffd17a;
    }
    
    .character-action.isMagicSkill::before,
    .character-action.isMagicSkill::after {
        border: 2px solid #f5f500;
        background: #ffff7a;
    }

    .character-action.isDisabled > button,
    .character-action.isDisabled > div {
        cursor: not-allowed;
    }

    .character-action.isDisabled::before,
    .character-action.isDisabled::after {
        border: 2px solid #7a7a7a;
        background: #bdbdbd;
    }

</style>