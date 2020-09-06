<template>
  <div id="app">
    <app-game-console></app-game-console>
  </div>
</template>

<script>
import GameConsole from './components/GameConsole.vue';

export default {
  components: {
    'app-game-console': GameConsole
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
</style>
