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
            return `need ${this.xpToLevelUp} XP to level up`
        }
    }, 
    computed: {
        ...mapGetters([ 'getUser' ]), 
        xpGained: function() {
            return this.profile.totalExp * 100 / this.profile.nextLevelExp
        },
        xpToLevelUp: function() {
            return this.profile.nextLevelExp - this.profile.totalExp
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