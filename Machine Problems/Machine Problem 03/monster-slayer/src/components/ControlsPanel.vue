<template>
    <div id="gameControlPanel">
        <div id="player1moves" v-if="!!this.matchState && this.povTurn === 1">
            <div id="basic-skills" class='game-control-group'>
                <div v-for="skill in basicSkills" 
                    :key="skill.name"
                    @mouseenter="showSkillDesription(skill, 'OVER')"
                    @mouseleave="showSkillDesription(skill, 'OUT')">
                    <button  
                        :disabled="skillInEffect || !enableSkill(skill)"
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
                        :disabled="skillInEffect || !enableSkill(skill)" 
                        @click="executeSkill(skill)">
                        {{ skill.name }}
                    </button>
                </div>
            </div>
        </div>
        <div id="skillDescription" v-if="!!this.matchState && this.povTurn === 1">
            <div id="skillWarning" v-if="skillWarning"> 
                <span class="warning-prefix">Warning: </span>
                {{ skillWarning }}
            </div>
            <div>{{ skillDescription }}</div>
        </div>
        <!-- <div id="endGameOptions" v-if="this.povTurn === 0">
            <div>
                <button type="button" @click="newMatch()">New Game</button>
            </div>
            <div>
                <button type="button" @click="quit()">Quit</button>
            </div>
        </div> -->
    </div>
</template>
<script>
import { eventBus } from '../main.js';
import { PlayerStats } from '../shared/PlayableCharacter'

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
            povTurn: 1,
            skillInEffect: false
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
            this.skillInEffect = true;
            const payLoad = {
                povSource: 1, 
                skillWielded: skill
            };
            eventBus.$emit('PLAYER_MOVED', payLoad );
        },
        newMatch: function() {
            eventBus.$emit('NEW_GAME', true);
            this.matchState = false;
            this.povTurn = 0;
        },
        quit: function() {
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
    created: function() {        
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
            this.skillInEffect = false;
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
        grid-template-rows: 75px 80px;
        grid-template-areas: "controls" "description";
        background-color: limegreen;
        border: 0.5px solid lime;
    }

    .game-control-group {
        display: flex;
        flex-flow: row nowrap;

    }

    #endGameOptions {
        grid-row: 1 / 3;
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center
    }

    #endGameOptions div {
        display: inline-block;
    }

    #player1moves {
        grid-area: controls;
        padding-bottom: 10px;
    }

    #player1moves button, 
    #endGameOptions button {
        font-size: 10px;
        font-weight: bold;
        padding: 6px 10px;
        min-width: 110px;
        border: none;
        border-radius: 5px;
        box-shadow: 0px 10px 14px -7px #f0f7fa;
        background:linear-gradient(to bottom, #33bdef 5%, #019ad2 100%);
        background-color:#33bdef;
        display:inline-block;
        cursor:pointer;
        color:#ffffff;
        text-decoration:none;
        text-shadow:0px 1px 0px #5b6178;
        cursor: default;
    }

    #player1moves button:not(:disabled):hover, 
    #endGameOptions button:not(:disabled):hover {
        background:linear-gradient(to bottom, #019ad2 5%, #33bdef 100%);
        background-color:#019ad2;
        cursor: default;
    }

    #player1moves button:disabled,
    #endGameOptions button:disabled {
        opacity: 65%;
        cursor: not-allowed;
    }

    #advanced-skills {
        margin-top: 10px;
    }

    #basic-skills div:not(:first-child),
    #advanced-skills div:not(:first-child), 
    #endGameOptions div:not(:first-child) {
        margin-left: 2px;
    }

    #skillDescription {
        grid-area: description;
        text-align: left;
        width: 100%;
        font-size: 10px;
        font-family: monospace;
    }

    #skillDescription div {
        max-width: fit-content;
    }

    #skillWarning {
        color: red;
    }

    .warning-prefix {
        font-weight: bold;
    }
</style>