<template>
    <div id="xp-container"
        :title="getTooltip()">
        <div id="xp-gained"
            :style="{ 'width' : `${xpGained}%` }">
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            profile: null
        }
    },
    methods: {
        getTooltip: function() {
            return this.isMaxedXp ? `XP maxed at ${this.profile.totalExp}`
                : `need ${this.xpToLevelUp} XP to level up`
        }
    }, 
    computed: {
        ...mapGetters([ 'getUser' ]), 
        xpGained: function() {
            return this.isMaxedXp ? 100 
                :this.profile.totalExp * 100 / this.profile.nextLevelExp
        },

        xpToLevelUp: function() {
            return this.profile.nextLevelExp - this.profile.totalExp
        }, 
        isMaxedXp: function() {
            return this.profile.nextLevelExp === 0;
        }
    }, 
    created() {
        this.profile = this.getUser
    }
}
</script>
<style>
    #xp-container {
        display: block !important;
        width: 100%;
        padding: 0 !important;
        justify-content: left !important;
        height: 12px;
        border: 0.5px solid goldenrod;
        overflow: hidden;
        border-radius: 15px;
    }

    #xp-gained {
        height: 10px;
        border-radius: 15px;
        background-color: gold
    }
</style>