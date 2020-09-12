<template>
    <div id="game-console">
        <div id="game-display">
            <div id="titleCard">{{ gameTitle }}</div>
            <app-profile-form v-if="!withSavedProfile"></app-profile-form>
            <!-- <app-splash-screen v-if="!gameState"></app-splash-screen> -->
            <app-match-display v-if="withSavedProfile"
                :player1="player1"
                :player2="player2"
                :withMPHandicap="true">
            </app-match-display>
        </div>
    </div>  
</template>

<script>
import { eventBus } from '../main';
import * as HELPERS from '../shared/Helpers.js'

import SplashScreen from './SplashScreen.vue';
import MatchDisplay from './MatchDisplay.vue';
import Player from '../shared/Player.js';
import ProfileForm from './ProfileForm.vue'
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
    data() {
        return {
            gameState: true,
            withSavedProfile: !!this.getSavedProfile(), 
            gameTitle: 'Monster Slayer', 
            player1: this.buildPlayerCharacter(),
            player2: new Player(2, 'Goblin', new Goblin()),
            matchState: true, 
            povTurn: 1
        }
    }, 
    components: {
        'app-splash-screen': SplashScreen, 
        'app-profile-form': ProfileForm,
        'app-match-display': MatchDisplay
    },
    methods: {
        startGame: function() {
            this.player1 = this.buildPlayerCharacter();
            this.player2 = new Player(2, 'Goblin', new Goblin());
            this.gameState = true;
            this.matchState = true; 
            this.povTurn = 1;
            this.withSavedProfile = !!this.getSavedProfile();
        },
        buildPlayerCharacter: function() {
            let character;
            const characterProfile = JSON.parse(this.getSavedProfile());

            if (!characterProfile) {
                character = new BaseCharacter('You');
            } else {
                switch (characterProfile.characterClass) {
                    case CharacterClass.SABER:
                        character = new Saber(characterProfile.characterName);
                        break;
                    case CharacterClass.ARCHER:
                        character = new Archer(characterProfile.characterName);
                        break;
                    case CharacterClass.LANCER:
                        character = new Lancer(characterProfile.characterName);
                        break;
                    case CharacterClass.BERSERKER:
                        character = new Berserker(characterProfile.characterName);
                        break;
                    case CharacterClass.CASTER:
                        character = new Caster(characterProfile.characterName);
                        break;
                }
            }

            return new Player(1, character.username, character);
        }, 
        getSavedProfile: function() {
            return localStorage.getItem('monster-slayer-app')
        }
    },
    created: function() {
        eventBus.$on('START_GAME', (gameState) => {
            this.startGame();
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
    #game-console {
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
    }
</style>