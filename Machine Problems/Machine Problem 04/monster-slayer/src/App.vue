<template>
  <div id="app">
    <div id="game-console">
        <div id="game-display">
            <div id="titleCard">{{ appConstants.appTitle }}</div>
            <div id="loadingSpinner" v-if="isLoading">
                <h4> Loading...</h4>
                <div class="spinner-border text-info" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            <router-view></router-view>
        </div>
    </div>  
  </div>
</template>

<script>
import { eventBus } from './main';
import * as APP_CONSTANTS from './shared/constants/constants.js';
import GameConsole from './components/GameConsole.vue';

export default {
  data() {
    return {
      appConstants: APP_CONSTANTS, 
      isLoading: false
    }
  }, 
  components: {
    'app-game-console': GameConsole
  }, 
  created: function() {
    eventBus.$on('SHOW_LOADING_SPINNER', (payload) => {
      ({ showSpinner: this.isLoading } = payload);
    })
  }
}
</script>

<style lang="scss">
  html {
      font-family: Monospace;
  }

  ::-webkit-scrollbar {
      width: 0px;
      background: transparent; /* make scrollbar transparent */
  }

  #app {
      display: flex;
      justify-content: center;
  }

  .error {    
      width: 100%;
      margin: 0.25rem;
      font-size: 65%;
      color: #dc3545;
      text-align: left    
  }

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
  }

</style>
