<template>
    <div id="match-display">

        <div id="matchStatsPanel">
            <app-player-stats-panel
                :pov="player1.pov" 
                :playerName="player1.name"
                :playerMaxHP="player1.character.maxHP"
                :playerMaxMP="player1.character.maxMP"
                :withMPHandicap="withMPHandicap"
                :criticalHPPercent="20"
                >
            </app-player-stats-panel>

            <div id="matchCounterPanel"></div>
            
            <app-player-stats-panel
                :pov="player2.pov" 
                :playerName="player2.name"
                :playerMaxHP="player2.character.maxHP"
                :playerMaxMP="player2.character.maxMP"
                :criticalHPPercent="20"
                :withMPHandicap="withMPHandicap"
                >
            </app-player-stats-panel>
        </div>

        <div id="gfxPanel">
            <!-- TO DO: place images here -->
        </div>

        <div id="footerPanel">
            <app-controls-panel 
                :skills="player1.character.skills"
                :maxHP="player1.character.maxHP"
                :maxMP="player1.character.maxMP"
                :hpLevel="player1.hpLevel"
                :mpLevel="player1.mpLevel"
                :withMPHandicap="withMPHandicap">
            </app-controls-panel>

            <app-battle-notification></app-battle-notification>
        </div>
    </div>
</template>
<script>
import { eventBus } from '../main';
import * as HELPERS from '../shared/Helpers.js'
//  enums and classes
import { SkillNatureType } from '../shared/Skill';
import Player from '../shared/Player.js';

//  components
import PlayerStatsPanel from './PlayerStatsPanel.vue';
import ControlsPanel from './ControlsPanel.vue'
import BattleNotification from './BattleNotification.vue'

export default {
    props: {
        player1: Object,
        player2: Object, 
        withMPHandicap: {
            type: Boolean, 
            default: false
        }
    },
    data() {
        return {
            matchState: true, 
            matchWinner: null,
            povTurn: 1
        }
    }, 
    components: {
        'app-player-stats-panel': PlayerStatsPanel, 
        'app-controls-panel': ControlsPanel, 
        'app-battle-notification': BattleNotification
    },
    methods: {
        quitGame(event) {
            eventBus.$emit('QUIT_GAME', true);
        }, 
        resetGame: function() {
            this.matchState = true; 
            this.povTurn = 1;
            this.matchWinner = 0;
        }
    }, 
    created() {
        eventBus.$on('NEW_GAME', () => {
            this.resetGame();
        }),
        eventBus.$on('END_GAME', payload => {
            const { povLost } = payload;
            console.log(`Player ${povLost} lose`);
            this.matchState = false;
            this.matchWinner = povLost !== 1 ? 1 : 2;
            this.povTurn = 0;
        });
        eventBus.$on('SWITCH_TURN', payload => {
            if ( !this.matchState ) {
                const endGameMessage = this.matchWinner === 1 ? `You win!` : `You lose`;
                eventBus.$emit('COMBAT_NOTIFICATION', { notification: endGameMessage });
            } else if ( !!this.matchState ) {
                ({ povTurn: this.povTurn } = payload);
                const turnMessage = (this.povTurn === 1
                        ? HELPERS.toPossessivePronoun(this.player1.name)
                        : HELPERS.toPossessivePronoun(this.player2.name)
                    ) + ' turn.';
                console.log(`${turnMessage}`);
                eventBus.$emit('COMBAT_NOTIFICATION', { notification: turnMessage });
                setTimeout(() => {
                    if (this.povTurn === 2) {
                        eventBus.$emit('PLAYER_MOVED', {
                            povSource: 2, 
                            skillWielded: this.player2.useRandomSkill()
                        });
                    }
                }, 2000);
            }
        });
    }
}
</script>
<style scoped>
    #match-display {
        width: 100%;
        text-align: center;
        background: url('../assets/468.jpg');
        background-size: cover;
        min-height: 350px;
    }

    #matchStatsPanel {
        display: flex;
        flex-flow: row nowrap;
        background-color: ghostwhite;
    }

    #matchCounterPanel {
        min-width: 100px;
    }

    #footerPanel {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, 50%);
        grid-area: "controls-panel notifications-panel"
    }
</style>