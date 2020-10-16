<template>
    <div id="battleground">
        <div class="arena" 
            :style="{ 'background-image' : getDungeonLansdscape() }">

            <div class="match-stats-panel">

                <div>
                    <app-player-stats-panel :pov="1" />
                </div>

                <div class="match-panel-spacer"></div>

                <div>
                    <app-player-stats-panel :pov="2" />
                </div>

            </div>

            <div class="battle-characters">
                <div>
                    <app-battle-character :pov="1" />
                </div>
                <div>
                    <app-battle-character :pov="2" />
                </div>
            </div>

            <div class="character-controls-panel"
                v-if="povTurn === 1">
                <app-character-actions :pov="1" />
            </div>
            <div class="character-controls-panel"
                v-if="povTurn === 2">
                <app-character-actions :pov="2" />
            </div>
        </div>
    </div>
  
</template>

<script>
import { mapGetters } from 'vuex';

//  compoonents 
import PlayerStatsPanel from './PlayerStatsPanel'
import BattleCharacter from './BattleCharacter'
import CharacterControls from './CharacterControls'

export default {
    components: {
        'app-player-stats-panel': PlayerStatsPanel, 
        'app-battle-character': BattleCharacter, 
        'app-character-actions': CharacterControls
    }, 

    methods: {
        getDungeonLansdscape() {
            return `url(${require(`../assets/dungeons/${this.dungeon.image}.jpg`)})`;
        }
    },

    computed: {
        ...mapGetters([[ 'getMatchData' ]]),
        match: function() {
            return this.getMatchData;
        }, 
        dungeon: function() {
            return this.getMatchData.dungeon;
        }, 
        povTurn: function() {
            return this.getMatchData.povTurn;
        }
    }

}
</script>

<style scoped>
    #battleground {
        display: flex;
        flex-flow: column nowrap; 
        align-items: center;
    }

    .arena {
        height: 400px;
        width: 800px;
        position: relative;
        display: flex;
        flex-flow: column nowrap;
    }

    .match-stats-panel,
    .battle-characters {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        width: 100%;
        flex: 1 1 0;
    }

    
    .match-stats-panel {
        flex: none;
    }

    .match-panel-spacer {
        min-width: 100px;
    }

    .battle-characters > div {
        flex: 1;
    }

    .character-controls-panel {
        position: absolute;
        top: 75px;
        width: 100%;
        min-height: 5px;
    }

</style>