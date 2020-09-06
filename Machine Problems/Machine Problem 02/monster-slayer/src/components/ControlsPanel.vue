<template>
    <div id="gameControlPanel">
        <div id="player1moves" v-if="!!this.matchState && this.povTurn === 1">
            <div id="basic-skills" class='game-control-group'>
                <div v-for="skill in basicSkills" 
                    :key="skill.name"
                    @mouseenter="showSkillDesription(skill, 'OVER')"
                    @mouseleave="showSkillDesription(skill, 'OUT')">
                    <button  
                        :disabled="!enableSkill(skill)"
                        @click="executeSkill(skill)">
                        {{ skill.name }}
                    </button>
                </div>
            </div>
            <div id="advanced-skills" class="game-control-group">
                <div v-for="skill in advancedSkills" 
                    :key="skill.name"
                    @mouseenter="showSkillDesription(skill, 'OVER')" 
                    @mouseleave="showSkillDesription(skill, 'OUT')">
                    <button 
                        :disabled="!enableSkill(skill)" 
                        @click="executeSkill(skill)">
                        {{ skill.name }}
                    </button>
                </div>
            </div>
        </div>
        <div id="skillDescription" v-if="!!this.matchState && this.povTurn === 1">
            <div id="skillWarning" v-if="skillWarning"> 
                <span class="warning-prefix">&#9888;Warning: </span>
                {{ skillWarning }}
            </div>
            <div>{{ skillDescription }}</div>
        </div>
        <!-- <div id="endGameOptions" v-if="this.povTurn === 0">
            <button type="button" @click.prevent="newMatch()">New Game</button>
            <button type="button" @click.prevent="quit()">Quit</button>
        </div> -->
    </div>
</template>
<script>
import { eventBus } from '../main.js';
import { PlayerStats } from '../shared/Skill.js'

export default {
    props: {
        skills: {
            type: Array,
            required: true
        }, 
        maxHP: {
            type: Number, 
            required: true
        }, 
        maxMP: {
            type: Number, 
            required: true
        }, 
        withMPHandicap: {
            type: Boolean, 
            default: false
        }
    },
    data() {
        return {
            currentHPLevel: this.maxHP,
            currentMPLevel: !!this.withMPHandicap ? this.maxMP * 0.65 : this.maxMP,
            skillWarning: '',
            skillDescription: '',
            matchState: true, 
            povTurn: 1
        }
    },
    methods: {
        enableSkill: function(skill) {
            const isGoodMP = skill.level === 0 ? true 
                : Math.abs(skill.mpCost) <= this.currentMPLevel;

            const isGoodStatCheck = skill.statCheck === null 
                || (skill.statCheck === PlayerStats.HP && this.currentHPLevel < this.maxHP)
                || (skill.level !== 0 && skill.statCheck === PlayerStats.MP && this.currentMPLevel > Math.abs(skill.mpCost))
                || (skill.level === 0 && skill.statCheck === PlayerStats.MP && this.currentMPLevel < this.maxMP);

            return isGoodMP && isGoodStatCheck;
        },
        showSkillDesription: function(skill, direction) {
            if (direction === 'OVER') {
                this.skillWarning = (skill.level !== 0 && this.currentMPLevel < Math.abs(skill.mpCost)) ? 'Skill unavailable due to insufficient mana'
                    : (skill.statCheck === PlayerStats.HP && this.currentHPLevel >= this.maxHP) ? 'Skill unavailable, Health is full.' 
                    // : (skill.level === 0 && skill.statCheck === PlayerStats.MP && this.currentMPLevel >= this.maxMP) ? 'Skill unavailable, Mana is full'
                    : (skill.statCheck === PlayerStats.MP && skill.mpCost > 0 && this.currentMPLevel >= this.maxMP) ? 'Skill unavailable, Mana is full'
                    : '';
                this.skillDescription = skill.description;
            } else {
                this.skillWarning = '';
                this.skillDescription = '';
            }
        }, 
        executeSkill: function(skill) {
            const payLoad = {
                povSource: 1, 
                skillWielded: skill
            };
            eventBus.$emit('PLAYER_MOVED', payLoad );
        },
        newMatch() {
            eventBus.$emit('NEW_GAME', true);
        },
        quit() {
            eventBus.$emit('QUIT_GAME', true);
        }
    },
    computed: {
        basicSkills: function() {
            return this.skills.filter(skill => skill.level === 0);
        }, 
        advancedSkills: function() {
            return this.skills.filter(skill => skill.level !== 0);
        }
    }, 
    created() {        
        eventBus.$on('UPDATE_PLAYER_STATS', payLoad => {
            const { targetPlayer, playerHP, playerMP } = payLoad;

            if (targetPlayer === 1) {
                this.currentHPLevel = playerHP;
                this.currentMPLevel = playerMP;
            } 
        });
        eventBus.$on('END_GAME', povLost => {
            this.matchState = false;
            this.povTurn = 0;
        }); 
        eventBus.$on('SWITCH_TURN', payload => {
            if ( !!this.matchState ) {
                ({ povTurn: this.povTurn } = payload);
            }
        });
    }

}
</script>
<style scoped>
    #gameControlPanel {
        padding: 10px;
        display: grid;
        grid-template-rows: repeat(2, 50%);
        grid-template-areas: "controls" "description";
        background-color: limegreen;
        border: 0.5px solid lime;
    }

    .game-control-group {
        display: flex;
        flex-flow: row nowrap;

    }
    #player1moves {
        grid-area: controls;
        padding-bottom: 10px;
    }

    #skillDescription {
        grid-area: description;
        /* height: 10%; */
    }

    #skillWarning {
        color: red;
    }

    .warning-prefix {
        font-weight: bold;
    }

    #endGameOptions {
        grid-area: controls description;
        text-align: center;
    }
</style>