<template>
    <div id="splash-screen">
        <button @click="startGame()">START</button>
    </div>
</template>
<script>
import { eventBus } from '../main';

export default {
    methods: {
        startGame(event) {
            eventBus.$emit('START_GAME', true);
        }
    }
}
</script>
<style scoped>
    #splash-screen {
        width: 100%;
        text-align: center;
    }
</style>