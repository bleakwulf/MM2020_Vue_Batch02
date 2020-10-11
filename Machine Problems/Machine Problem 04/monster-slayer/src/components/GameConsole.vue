<template>
    <div>
        <app-match-display v-if="withSavedProfile && !isLoading"
            :player1="player1"
            :player2="player2"
            :withMPHandicap="appConstants.withMPHandicap">
        </app-match-display>
    </div>
</template>

<script>
import { eventBus } from '../main';
import * as APP_CONSTANTS from '../shared/constants/constants.js';
import * as HELPERS from '../shared/Helpers.js'

import AccountsApiMixin from '../shared/api-mixins/AccountsApiMixin.vue'

import MatchDisplay from './MatchDisplay.vue';
import Player from '../shared/Player.js';
import {  
    CharacterClass, 
    PlayableCharacter, 
    BaseCharacter,
    Archer, 
    Lancer, 
    Berserker, 
    Caster, 
    Goblin, 
    Saber
} from '../shared/PlayableCharacter.js'

export default {
    mixins: [
        AccountsApiMixin
    ],
    data() {
        return {
            appConstants: APP_CONSTANTS, 
            gameState: true,
            withSavedProfile: !!this.getSavedProfile(), 
            player1: this.buildPlayerCharacter(),
            player2: new Player(2, 'Goblin', new Goblin()),
            matchState: true, 
            povTurn: 1, 
            isLoading: false
        }
    }, 
    components: {
        'app-match-display': MatchDisplay
    },
    methods: {
        startGame: function() {
            this.player1 = this.buildPlayerCharacter();
            this.player2 = new Player(2, 'Goblin', new Goblin());
            this.gameState = true;
            this.matchState = true; 
            this.povTurn = 1;
            this.isLoading = false;
            this.withSavedProfile = !!this.getSavedProfile();
        },
        buildPlayerCharacter: function() {
            const characterProfile = JSON.parse(this.getSavedProfile());
            if (!characterProfile) {
                return new Player(1, 'You', new BaseCharacter('You'));
            }
            return new Player(1, characterProfile.name, characterProfile);
        }, 
        mapCharacterSpecs(profile) {},
        getSavedProfile: function() {
            return localStorage.getItem('monster-slayer-app');
        }
    },
    created: function() {
        eventBus.$on('START_GAME', (gameState) => {
            this.isLoading = true;
            setTimeout( () => { this.startGame() }, 2000 );
        }),
        eventBus.$on('NEW_GAME', () => {
            this.isLoading = true;
            setTimeout( () => { this.startGame() }, 2000 );
        }),
        eventBus.$on('QUIT_GAME', gameState => {
            this.gameState = false;
            this.matchState = false; 
            this.povTurn = 0;
        }),
        eventBus.$on('END_GAME', povLost => {
            this.matchState = false;
            this.povTurn = 0;
        }); 
        eventBus.$on('UPDATE_PLAYER_STATS', payLoad => {
            const { targetPlayer, playerHP, playerMP } = payLoad;

            if (targetPlayer === 1) {
                this.player1.hpLevel = playerHP;
                this.player1.mpLevel = playerMP;
            } else if (targetPlayer === 2) {
                this.player2.hpLevel = playerHP;
                this.player2.mpLevel = playerMP;
            } 
        });
    }, 
}
</script>

<style scoped>
    /* #game-console {
        display: flex;
        flex-flow: column;
        min-width: 800px;
        align-items: center;
        border-radius: 10px;
        padding: 10px;
        box-shadow: 0.5px 0.5px #2b665e;
        border: 0.5px solid #768d87;
        background-color: #effcec;
    }

    #loadingSpinner {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        color: #17a2b8;
        font-family: monospace;
        font-weight: bold;
    }

    #game-display {
        width: 100%;
        border: 0.5px solid grey;
        border-radius: 5px;
        box-sizing: border-box;
        padding: 10px;
        display: flex;
        flex-flow: column;
        min-height: 190px;
        background-color: ghostwhite;
    }

    #titleCard {
        font-family: "Courier New", Courier, monospace;
        text-align: center;
        text-transform: uppercase;
        font-size: 3em;
        font-weight: bold;
    } */
</style>