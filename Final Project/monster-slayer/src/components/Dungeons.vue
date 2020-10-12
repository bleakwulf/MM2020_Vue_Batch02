<template>
    <div id="dungeon-panel">
        <div class="dungeons-list">
            <div v-for="dungeon in getDungeons"
                :key="dungeon._id"
                class="dungeon-tile" 
                :class="{ 'is-selected' : !!selectedDungeon && selectedDungeon._id === dungeon._id }"
                @click="setDungeonCardDisplay(dungeon)">
                <img class="dungeon-tile-img" :src="require('../assets/dungeons/' + dungeon.image + '.jpg')" />
                <div v-if="dungeon.locked"
                    class="dungeon-lock">
                    <font-awesome-icon :icon="['fas', 'lock']" size="5x"/>
                </div>
            </div>
        </div>

        <div class="dungeon-card">
            <div v-if="!!selectedDungeon"
                class="dungeon-details">
                <div class="header">{{ selectedDungeon.name }}</div>
                <div class="field-row">
                    <div>Recommended Level</div>
                    <div>{{ selectedDungeon.recommendedLevel }}</div>
                </div>

                <div class="locked-message"
                    v-if="selectedDungeon.locked">
                    <span class="info-icon">
                        <font-awesome-icon :icon="['fas', 'info-circle']" size="1x"/>
                    </span>
                    Defeat <strong>{{ selectedDungeon.bossReq.name }}</strong> from previous dungeon to unlock this dungeon.
                </div>

                <div v-if="!selectedDungeon.locked && getDungeonEncounters().length > 0"
                    class="sublist">
                    <div class="sublist-caption">Encounters / Enemies</div>
                    <div class="sublist-items">
                        <ul>
                            <li v-for="encounter in getDungeonEncounters()" :key="encounter._id">
                                {{ encounter.name }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div v-if="!selectedDungeon.locked && getDungeonBoss().length > 0"
                    class="sublist">
                    <div class="sublist-caption">Dungeon Boss</div>
                    <div class="sublist-items">
                        <ul>
                            <li v-for="boss in getDungeonBoss()" :key="boss._id">
                                {{ boss.name }}
                            </li>
                        </ul>
                    </div>
                </div>

                <div v-if="!selectedDungeon.locked"
                    class="fixed-bottom-action">
                    <button type="button">ENTER</button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
    data() {
        return {
            dungeons: null, 
            selectedDungeon: null
        }
    },

    methods: {
        ...mapActions([ 'loadDungeons' ]), 

        setDungeonCardDisplay: function(dungeon) {
            this.selectedDungeon = dungeon;
        }, 

        getDungeonEncounters: function() {
            return this.selectedDungeon.enemies.filter( enemy => !enemy.boss);
        },

        getDungeonBoss: function() {
            return this.selectedDungeon.enemies.filter( enemy => enemy.boss);
        }
    }, 

    computed: {
        ...mapGetters([ 'getDungeons' ])
    }, 

    async created() {
        await this.loadDungeons()
            .then( res => {
                this.dungeons = this.getDungeons
            });
            
        //  sort dungeons per recommended level
        if (this.dungeons && this.dungeons.length > 0) {
            this.dungeons = this.dungeons.sort( (a, b) => a.recommendedLevel > b.recommendedLevel ? 1 : -1);
        }
    }

}
</script>

<style>
    #dungeon-panel{
        display: flex;
        flex-flow: row nowrap;
    }

    .dungeons-list {
        flex: 1;
        overflow-y: scroll;
        /* height: 450px; */
        height: calc(100vh - 160px);
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        box-shadow: inset 5px 5px 25px #d9d9d9, 
                    inset -5px -5px 25px #ffffff, 
                    20px 20px 40px #d9d9d9, 
                    -20px -20px 40px #ffffff;
        border: 1px solid #ffffff;
        border-radius: 10px;
        margin-right: 20px;
    }

    .dungeons-list::-webkit-scrollbar {
        width: 5px !important;
    }

    .dungeons-list::-webkit-scrollbar-thumb {
        background-color: lightgrey !important;
        border-radius: 5px !important;
    }

    .dungeons-list::-webkit-scrollbar-track {
        background: transparent !important;
    }

    .dungeon-tile {
        height: 150px;
        width: 300px;
        position: relative;
        margin: 15px 0;
    }

    .dungeon-tile.is-selected {
        background: #e8ee9b;
        box-shadow:  10px 10px 20px #c5ca84, 
                    -10px -10px 20px #ffffb2;
    }

    .dungeon-tile img.dungeon-tile-img {
        height: 150px !important;
        width: 300px !important;
        position: relative;
    }
    
    .dungeon-lock {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: block;
        background: rgba(0, 0, 0, .6);
        color: silver;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .dungeon-card {
        position: relative;
        text-align: center;
        flex: 1;
        padding: 20px;
        display: flex;
        flex-flow: column nowrap;
        text-align: center;
        box-shadow: inset 5px 5px 25px #d9d9d9, 
                    inset -5px -5px 25px #ffffff, 
                    20px 20px 40px #d9d9d9, 
                    -20px -20px 40px #ffffff;
        border: 1px solid #ffffff;
        border-radius: 10px;
        padding: 20px 30px;
        margin-left: 20px;
        margin-right: 5px;
        font-size: 14px;
    }

    .dungeon-card .locked-message {
        margin-top: 10px;
    }
    
    .dungeon-details {
        height: 100%;;
    }

    .dungeon-details .header {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 1.25rem;
        margin-bottom: 10px;
    }

    .dungeon-details .field-row {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        text-align: left;    
        margin-bottom: 3px;
        padding: 6px 0;
        border-bottom: 0.5px solid #f2f3f4;
    }
    
    .dungeon-details .field-row div:first-child {
        flex: 2;
        justify-content: flex-start;
        padding-left: 10px;
        font-size: 14px;
    }
    
    .dungeon-details .field-row div:last-child {
        flex: 1;
        text-align: center;
        font-size: 14px;
        font-weight: 700;
    }

    .dungeon-details .sublist {
        margin-top: 10px;
        border-bottom: 0.5px solid #f2f3f4;
    }
    .dungeon-details .sublist .sublist-caption {
        text-align: left;
        padding-left: 10px;
    }

    .dungeon-details .sublist .sublist-items ul {
        list-style: none;
        text-align: left;
        font-weight: 500;
    }

    .dungeon-details .fixed-bottom-action {
        position: absolute;
        bottom: 25px;
        text-align: center;
        width: 100%;
        right: 0;
    }

    .dungeon-details .fixed-bottom-action button {
        border: 0;
        background: linear-gradient(145deg, #ffffff, #e6e6e6);
        box-shadow: 12px 12px 37px #a1a1a1, 
                    -12px -12px 37px #ffffff;
        padding: 13px 20px;
        border-radius: 15px;
        min-width: 150px;
    }

    
    .dungeon-details .fixed-bottom-action button:focus {
        outline: none;
    }


</style>