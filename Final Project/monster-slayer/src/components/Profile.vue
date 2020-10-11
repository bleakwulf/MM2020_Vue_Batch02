<template>
    <div id="profile-panel">
        <div>
            <img :src="require('../assets/class/' + imgSrc)">
        </div>
        <div>
            <div id="profile-details">
                <div class="header"> {{ profile.name }}</div>
                <div class="field-row">
                    <div>Class</div>
                    <div>{{ classType }}</div>
                </div>
                <div class="field-row">
                    <div>Level</div>
                    <div>{{ profile.level }}</div>
                </div>
                <div class="field-row">
                    <div>XP</div>
                    <div class="bar-display">
                        <app-xp-bar />
                    </div>
                </div>
            </div>
            <br />
            <app-attr-stats />
            
        </div>
        <br />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
//  constants
import { CharacterClass } from '../shared/constants/Constants.js';

//  helpers
import * as HELPERS from '../shared/helpers/Helpers.js'

//  components
import XPBarDisplay from './XPBarDisplay'
import AttributeStats from './AttributeStats'

export default {
    components: {
        'app-xp-bar': XPBarDisplay,
        'app-attr-stats': AttributeStats
    },
    data() {
        return {
            profile: null, 
            eCharacterClass: CharacterClass
        }
    }, 
    computed: {
        ...mapGetters([ 'getUser']),
        characterClasses: function() {            
            return Object.keys(CharacterClass)
                .filter(x => !(parseInt(x) >= 0))
                .map( (charaClass) => {
                    return { 
                        id: this.eCharacterClass[charaClass], 
                        name: HELPERS.toProperCase( charaClass  )
                    }
                })
        },
        classType: function() {
            return this.characterClasses
                .find(classType => classType.id === this.profile.classType ).name
        },
        imgSrc: function() {
            // return `../assets/class/${this.classType.toLowerCase()}.png`
            return `${this.classType.toLowerCase()}.png`
        }
    }, 
    created() {
        this.profile = this.getUser
    }


}
</script>
<style>

    #profile-panel {
        display: flex;
        flex-flow: row nowrap;
        align-items: stretch;
        justify-content: space-around;
    }

    #profile-details {
        text-align: center;
        border-radius: 10px;
        background: #ffffff;
        box-shadow:  20px 20px 60px #d9d9d9, 
                    -20px -20px 60px #ffffff;
        padding: 15px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        text-align: center;
    }
    
    #profile-details div {
        display: flex;
        flex-flow: row nowrap;
        padding: 0 10px;
        justify-content: center;
    }
    #profile-details .header {
        font-weight: bold;
        text-transform: uppercase;
        ;font-size: 1.25rem;
    }
    
    #profile-details div.field-row {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        text-align: left;
    }
    
    #profile-details div.field-row div:first-child {
        width: 100px;
        justify-content: flex-start;
    }
    
    #profile-details div.field-row div:last-child {
        flex: 1;
        justify-content: flex-start;
        font-weight: 700;
    }

    .bar-display {
        padding: 0 10px;
        width: 100%;
        align-items: center;
    }

</style>