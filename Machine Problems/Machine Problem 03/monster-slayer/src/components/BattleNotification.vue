<template>
    <div id="logsPanel" v-html="notification"></div>
</template>

<script>
import { eventBus } from '../main.js';
export default {
    data() {
        return {
            notification: ''
        }
    }, 
    created: function() {
        eventBus.$on('COMBAT_NOTIFICATION', payLoad => {
            const { notification, displayDuration = null } = payLoad;
            this.notification = notification.replace('\n', '<br/>');
            if (!!displayDuration) {
                setTimeout(() => {this.notification = ''}, displayDuration);
            } 
        })
    }
}
</script>
<style scoped>
    #logsPanel {
        width: 100%;
        border: 0.5px solid grey;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 5px;
        font-family: monospace;
        color: lightgray;
        font-size: 12px;
        background-color: #000;
        box-shadow: inset 1px 1px 3px grey, inset -1px -1px 3px dimgrey;
        text-align: center;
        /* height: 100px; */
        overflow-y: scroll;
        position: relative;
        display: flex;
        align-content: stretch;
        justify-content: center;
        align-items: center;
        font-weight: bold
    }
</style>