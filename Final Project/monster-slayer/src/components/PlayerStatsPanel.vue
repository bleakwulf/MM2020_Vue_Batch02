<template>
    <div class="player-panel" :title="showTooltipStat()">
        <div class="health-bar"
            :class="{ 'health-bar-p1pov': pov === 1 , 
                      'health-bar-p2pov': pov === 2 }">
            <div class="health bar-metrics" 
                :class="{ 'critical-health': isCriticalHP }"
                :style="{ 'width': hpBar + '%' }"></div>
            <div class="damage bar-metrics" 
                :class="{ 'bar-metrics-p2pov': pov === 2 }"
                :style="{ 'width': hpGainBar + '%' }"></div>
            <div class="gain bar-metrics" 
                :class="{ 'bar-metrics-p2pov': pov === 2 }"
                :style="{ 'width': hpDamageBar + '%' }"></div>
        </div>
        <div class="mana-bar"
            :class="{ 'mana-bar-p1pov': pov === 1 , 
                      'mana-bar-p2pov': pov === 2 }">
            <div class="mana bar-metrics" 
                :style="{ 'width': mpBar + '%' }"></div>
            <div class="damage bar-metrics" 
                :class="{ 'bar-metrics-p2pov': pov === 2 }"
                :style="{ 'width': mpDamageBar + '%' }"></div>
            <div class="gain bar-metrics" 
                :class="{ 'bar-metrics-p2pov': pov === 2 }"
                :style="{ 'width': mpGainBar + '%' }"></div>

        </div>
        <div class="player-name"
            :class="{ 'player-name-p2pov': pov === 2}">
            {{ getPlayerLabel() }}
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        pov: {
            type: Number,
            required: true
        }
    }, 

    data() {
        return {
            hpBar: 100,
            hpGainBar: 0,
            hpDamageBar: 100,
            mpBar: 100,
            mpGainBar: 0,
            mpDamageBar: process.env.VUE_APP_APPLY_MP_HANDICAP ? process.env.VUE_APP_MP_HANDICAP_LIMIT : 100
        }
    },

    methods: {
        showTooltipStat() {
            return `Health: ${this.HP}${'\n'}Mana: ${this.MP}`;
        }, 
        getPlayerLabel() {
            return `Level ${this.profile.level} ${this.profile.name}`;
        }
    }, 

    computed: {
        ...mapGetters([ 'getMatchData' ]), 
        profile: function() {
            return this.pov === 1 ? this.getMatchData.p1 : this.getMatchData.p2;
        },
        stats: function() {
            return this.profile.stats
        }, 
        HP: function() { return this.stats.health }, 
        MP: function() { return this.stats.mana }, 
        isCriticalHP: function() {
            return Math.round((this.HP / this.stats.maxHp) * 100) <= process.env.VUE_APP_CRITICAL_HP_THRESHOLD;
        }
    }, 

    watch: {
        HP: function(newHp, oldHp ) {
            if (oldHp !== newHp) {

                const newHPBarWidth = newHp / this.stats.maxHp * 100;
                if (oldHp > newHp) {
                    // HP damage incurred; delay width of HPDamageBar
                    this.hpBar = this.hpGainBar = newHPBarWidth
                    setTimeout(() => { this.hpDamageBar = newHPBarWidth }, 500);
                } else {
                    // HP regained; delay width of HPBar and HPDamageBar
                    this.hpGainBar = newHPBarWidth
                    setTimeout(() => { this.hpDamageBar = this.hpBar = newHPBarWidth }, 500);
                }
            }
        }, 
        MP: function(newMP, oldMP) {
            if( oldMP !== newMP) {  
                const newMPBarWidth = newMP / this.stats.maxMp * 100;
                if (oldMP > newMP) {
                    // MP depletion incurred; delay width of MPDamageBar
                    this.mpBar = this.mpGainBar = newMPBarWidth
                    setTimeout(() => { this.mpDamageBar = newMPBarWidth }, 500);
                } else {
                    // MP regained; delay width of MPBar and MPDamageBar
                    this.mpGainBar = newMPBarWidth
                    setTimeout(() => { this.mpDamageBar = this.mpBar = newMPBarWidth }, 500);
                }
            }
        }
    }, 

    created() {
        this.hpBar = this.HP / this.stats.maxHp * 100;
        this.mpBar = this.MP / this.stats.maxMp * 100;
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
        /* background-color: lightgrey; */
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
        font-size: 10px;
        font-family: monospace;
        font-weight: bolder;
        color: ghostwhite;
        /* filter: invert(1) grayscale(1) contrast(2) drop-shadow(0 3px 1px orange); */
        text-shadow: 1px 1px 0 #000, 
                    1px -1px 0 #000, 
                    -1px 1px 0 #000, 
                    -1px -1px 0 #000, 
                    1px 0px 0 #000, 
                    0px 1px 0 #000, 
                    -1px 0px 0 #000, 
                    0px -1px 0 #000
    }
    
    .player-name-p2pov {
        margin: 5px 10px;
        float: right;
    }

</style>