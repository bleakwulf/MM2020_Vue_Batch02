<template>
    <div class="player-panel">
        <div class="health-bar"
            :title="showTooltipStat('HP')"
            :class="{ 'health-bar-p1pov': pov === 1 , 
                      'health-bar-p2pov': pov === 2 }">
            <div class="health bar-metrics" 
                :class="{ 'critical-health': isCriticalHP }"
                :style="{ 'width': playerHPBar + '%' }"></div>
            <div class="damage bar-metrics" 
                :class="{ 'bar-metrics-p2pov': pov === 2 }"
                :style="{ 'width': playerHPDamageBar + '%' }"></div>
            <div class="gain bar-metrics" 
                :class="{ 'bar-metrics-p2pov': pov === 2 }"
                :style="{ 'width': playerHPGainBar + '%' }"></div>
        </div>
        <div class="mana-bar"
            :title="showTooltipStat('MP')"
            :class="{ 'mana-bar-p1pov': pov === 1 , 
                      'mana-bar-p2pov': pov === 2 }">
            <div class="mana bar-metrics" 
                :style="{ 'width': playerMPBar + '%' }"></div>
            <div class="damage bar-metrics" 
                :class="{ 'bar-metrics-p2pov': pov === 2 }"
                :style="{ 'width': playerMPDamageBar + '%' }"></div>
            <div class="gain bar-metrics" 
                :class="{ 'bar-metrics-p2pov': pov === 2 }"
                :style="{ 'width': playerMPGainBar + '%' }"></div>

        </div>
        <div class="player-name"
            :class="{ 'player-name-p2pov': pov === 2}">
            {{ playerName }}
        </div>
    </div>
</template>

<script>
import { eventBus } from '../main';
import { SkillNatureType } from '../shared/Skill.js'

export default {
    props: {
        pov:{ 
            type: Number, 
            required: true
        }, 
        playerName: {
            type: String,
            required: true
        },
        playerMaxHP: Number,
        playerMaxMP: Number,
        withMPHandicap: {
            type: Boolean, 
            default: false
        },
        criticalHPPercent: Number
    }, 
    data() {
        return {
            playerHP: this.playerMaxHP || 100,
            playerHPBar: 100,
            playerHPGainBar: 0,
            playerHPDamageBar: 100,
            playerMP: !!this.withMPHandicap ? this.playerMaxMP * 0.65 : this.playerMaxMP || 100,
            playerMPBar: !!this.withMPHandicap ? 65 : 100,
            playerMPDamageBar: !!this.withMPHandicap ? 65 : 100,
            playerMPGainBar: !!this.withMPHandicap ? 65 : 100,
            isEnemyAttack:  false
        };
    }, 
    methods: {
        showTooltipStat(statAttribbute) {
            return statAttribbute === 'HP' ? `Health: ${this.playerHP}`
                : statAttribbute === 'MP' ? `Mana: ${this.playerMP}`
                : '';
        }
    },
    computed: {
        isCriticalHP: function() {
            return Math.round((this.playerHP / this.playerMaxHP) * 100) <= this.criticalHPPercent;
        }
    },
    created() {
        eventBus.$on('PLAYER_MOVED', payload => {
            const { povSource, skillWielded } = payload;
            const eventEmitIntervals = 2000;
            
            this.isEnemyAttack = povSource !== this.pov && 
                [SkillNatureType.OFFENSE, SkillNatureType.SPECIAL].some(skillNature => skillNature === skillWielded.nature);

            if (!!this.isEnemyAttack) {
                // take damage points
                const playerHP = this.playerHP - skillWielded.hpDamage;
                const playerMP = this.playerMP - skillWielded.mpDamage;

                this.playerHP = playerHP < 0 ? 0 : playerHP;
                this.playerMP = playerMP < 0 ? 0 : playerMP;
            
                const newPayLoad = {
                    targetPlayer: this.pov, 
                    playerHP: this.playerHP, 
                    playerMP: this.playerMP 
                };

                eventBus.$emit('UPDATE_PLAYER_STATS', newPayLoad);
                if (this.playerHP === 0) {
                    eventBus.$emit('END_GAME', { povLost: this.pov } );
                }

            } else if(povSource === this.pov)  {

                const canGainHP = this.playerHP >= this.playerMaxHP;
                const canGainMP = this.playerMP >= this.playerMaxMP;

                const playerNewHP = this.playerHP + skillWielded.hpCost || 0;
                const playerNewMP = this.playerMP + skillWielded.mpCost || 0;

                this.playerHP = playerNewHP > this.playerMaxHP ? this.playerMaxHP
                    : playerNewHP < 0 ? 0
                    : playerNewHP;

                this.playerMP = playerNewMP > this.playerMaxMP ? this.playerMaxMP
                    : playerNewMP < 0 ? 0
                    : playerNewMP;
                    
                const playerStatPayload = {
                    targetPlayer: this.pov, 
                    playerHP: this.playerHP, 
                    playerMP: this.playerMP 
                };

                const damageLog = [];
                
                if ([ SkillNatureType.OFFENSE, SkillNatureType.SPECIAL].some(skillNature => skillNature === skillWielded.nature)) {
                    (skillWielded.hpDamage > 0) && damageLog.push(`Dealt ${skillWielded.hpDamage} damage points`);
                    (skillWielded.mpDamage > 0) && damageLog.push(`Dealt ${skillWielded.mpDamage} damage points to ${ povSource !== 1 ? 'your' : `enemy's`} mana.`); 
                } 
                
                if ([ SkillNatureType.NEUTRAL, SkillNatureType.SPECIAL ].some(skillNature => skillNature === skillWielded.nature)) { 
                    (skillWielded.hpCost > 0) && canGainHP && damageLog.push(`${ povSource === 1 ? 'You' : 'Enemy' } gained ${skillWielded.hpCost} health points.`); 
                    (skillWielded.mpCost > 0) && canGainMP && damageLog.push(`${ povSource === 1 ? 'You' : 'Enemy' } gained ${skillWielded.mpCost} mana points.`); 
                }
                
                const combatLog = `${ povSource === 1 ? 'You' : 'Enemy' } used ${skillWielded.name}.${'\n'}${damageLog.join('\n')}`;
                console.log(combatLog);

                const notificationPayLoad = {
                    notification : `${ povSource === 1 ? 'You' : 'Enemy' } used ${skillWielded.name}.${'\n'}${damageLog.join(`${'\n'}`)}`,
                    displayDuration: eventEmitIntervals
                }

                eventBus.$emit('UPDATE_PLAYER_STATS', playerStatPayload);
                eventBus.$emit('COMBAT_NOTIFICATION', notificationPayLoad);
                setTimeout(() => {
                    eventBus.$emit('SWITCH_TURN', { povTurn: povSource === 1 ? 2 : 1 });
                }, eventEmitIntervals);

            } 
        })
    },  
    watch: {
        playerHP: function(newValue, oldValue) {
            if( oldValue !== newValue) {
                const newHPBarWidth = this.playerHP / this.playerMaxHP * 100;
                if (oldValue > newValue) {
                    // HP damage incurred; delay width of HPDamageBar
                    this.playerHPBar = this.playerHPGainBar = newHPBarWidth
                    setTimeout(() => { this.playerHPDamageBar = newHPBarWidth }, 500);
                } else {
                    // HP regained; delay width of HPBar and HPDamageBar
                    this.playerHPGainBar = newHPBarWidth
                    setTimeout(() => { this.playerHPDamageBar = this.playerHPBar = newHPBarWidth }, 500);
                }
            }
        },
        playerMP: function(newValue, oldValue) {
            if( oldValue !== newValue) {
                const newMPBarWidth = this.playerMP / this.playerMaxMP * 100;
                if (oldValue > newValue) {
                    // MP depletion incurred; delay width of MPDamageBar
                    this.playerMPBar = this.playerMPGainBar = newMPBarWidth
                    setTimeout(() => { this.playerMPDamageBar = newMPBarWidth }, 500);
                } else {
                    // MP regained; delay width of MPBar and MPDamageBar
                    this.playerMPGainBar = newMPBarWidth
                    setTimeout(() => { this.playerMPDamageBar = this.playerMPBar = newMPBarWidth }, 500);
                }
            }
        }
    }
    
}
</script>

<style scoped>

        .player-panel {
            padding: 20px;
            box-sizing: content-box;
            min-width: 300px;
        }

        .health-bar {
            box-sizing: border-box;
            min-width: 200px;
            height: 15px;
            position: relative;
            background-color: transparent;
            box-sizing: border-box;
            background-color: lightgrey;
        }

        .mana-bar {
            box-sizing: border-box;
            min-width: 200px;
            height: 4px;
            position: relative;
            background-color: transparent;
            box-sizing: border-box;
            margin: 0.5px -9px 0 8px;
            transform: skewX(45deg);
            box-shadow: -7px 4px 10px 0px grey
        }

        .health-bar-p1pov {
            transform: skew(45deg);
            box-shadow: -5px 4px 8px grey,
                0.5px -0.5px 0px 0px grey, 
                -0.5px 0.5px 0px 0px grey,
                inset 0.5px -0.5px 0px 0px grey, 
                inset -0.5px 0.5px 0px 0px grey;
        }

        .health-bar-p2pov {
            transform: skew(135deg);
            box-shadow: 5px 4px 8px grey,
                0.5px -0.5px 0px 0px grey, 
                -0.5px 0.5px 0px 0px grey, 
                inset 0.5px -0.5px 0px 0px grey, 
                inset -0.5px 0.5px 0px 0px grey;
        }

        .mana-bar-p1pov {
            margin: 0.5px -9px 0 8px;
            transform: skewX(45deg);
            box-shadow: -7px 4px 10px 0px grey
        }

        .mana-bar-p2pov {
            margin: 0.5px 9px 0 -8px;
            transform: skewX(135deg);
            box-shadow: 7px 4px 10px 0px grey
        }

        .health-bar-p1pov .bar-metrics,
        .mana-bar-p1pov .bar-metrics {
            top: 0;
            right: 0;
        }

         .health-bar-p2pov .bar-metrics,
         .mana-bar-p2pov .bar-metrics {
            top: 0;
            left: 0;
        }

        .health {
            height: 100%;
            position: absolute;
            background-color: limegreen;
            box-sizing: border-box;
            transition: width 0.5s linear;
        }

        .mana {
            height: 100%;
            position: absolute;
            background-color: gold;
            box-sizing: border-box;
            transition: width 0.5s linear;
        }

        .critical-health {
            background-color: red;
        }

        .damage {
            height: 100%;
            position: absolute;
            background-color: lightsalmon;
            z-index: -1;
            box-sizing: border-box;
            transition: width 0.5s linear;
        }

        .gain {
            height: 100%;
            position: absolute;
            background-color: skyblue;
            z-index: -1;
            box-sizing: border-box;
            transition: width 0.5s linear;
        }

        .player-name {
            margin: 5px 10px;
            float: left;
        }
        
        .player-name-p2pov {
            margin: 5px 10px;
            float: right;
        }

</style>