<template>
    <div id="attr-stats">
        <div class="attr-stats-title">Stats</div>
        <div class="attr-header" >
            <div>Attribute</div>
            <div>Items' Effect</div>
            <div>Value</div>
        </div>
        <div class="attr-detail" v-for="attr in attrList" :key="attr">
            <div>{{ eAttributes[attr].displayName }}</div>
            <div :class="{ 
                    'attr-increase': getItemsEffect(attr) > 0, 
                    'attr-decrease': getItemsEffect(attr) < 0, 
                }">{{ getItemsEffect(attr) }}</div>
            <div :class="{ 
                    'attr-increase': getItemsEffect(attr) > 0, 
                    'attr-decrease': getItemsEffect(attr) < 0, 
                }">{{ computedStats[attr] }}</div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Attributes } from '../shared/constants/Constants'
export default {
    data() {
        return {
            originalStats: null, 
            computedStats: null,
            eAttributes: Attributes
        }
    },
    methods: {
        getItemsEffect: function(attr) {
            const attrDiff = this.computedStats[attr] - this.originalStats[attr];
            return attrDiff > 0 ? `+${attrDiff}` 
                : attrDiff === 0 ? '' : attrDiff;
        }
    },
    computed: {
        ...mapGetters([ 'getCharacterStats', 'getComputedStats' ]), 
        attrList: function() {
            return Object.keys(this.computedStats)
        }, 
    },
    created() {
        this.originalStats = this.getCharacterStats,
        this.computedStats = this.getComputedStats
    }
}
</script>

<style>
    #attr-stats {
        border-radius: 10px;
        background: #ffffff;
        box-shadow:  20px 20px 60px #d9d9d9, 
                    -20px -20px 60px #ffffff;
        padding: 15px;
    }
    .attr-stats-title {
        font-size: 1rem;
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;
        padding-bottom: 5px;
        border-bottom: 1px solid seagreen;
        margin-bottom: 10px;
    }

    .attr-header, 
    .attr-detail {
        text-align: center;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
    }
    .attr-header {
        font-weight: bold;
        text-transform: uppercase;
    } 

    .attr-header div:first-child {
        width: 60%;
        align-content: flex-start;
    } 

    .attr-detail div:first-child {
        width: 60%;
        align-content: flex-start;
        text-align: left;
    }

    .attr-header div:not(:first-child), 
    .attr-detail div:not(:first-child) {
        width: 20%;
    }

    .attr-increase {
        color: limegreen;
        font-weight: bold;
    }

    .attr-decrease {
        color: crimson;
        font-weight: bold;
    }
</style>