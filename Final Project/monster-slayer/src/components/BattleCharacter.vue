<template>
    <div class="battle-character">
        <img :src="require('../assets' + imageSrc)"
            :class="{ 
                'p1-character' : pov === 1,
                'p2-character' : pov === 2
            }" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

//  constants
import { CHARACTER_CLASS } from '../shared/constants/Constants.js';

export default {
    props: {
        pov: {
            type: Number,
            required: true
        }
    }, 

    data() {
        return {
            eCharacterClass: CHARACTER_CLASS
        }
    }, 

    computed: {
        ...mapGetters([ 'getMatchData' ]), 

        profile: function() {
            return this.pov === 1 ? this.getMatchData.p1 : this.getMatchData.p2;
        }, 

        imageSrc: function() {
            const imgFileName = this.pov === 1 
                ? (Object.keys(CHARACTER_CLASS)
                    .filter(x => !(parseInt(x) >= 0))
                    .map( (charaClass) => {
                        return { 
                            id: this.eCharacterClass[charaClass], 
                            name: charaClass
                        }
                    })).find(classType => classType.id === this.profile.classType)
                    .name.toLowerCase()
                : this.profile.image;

            return this.pov === 1 
                ? `/class/${imgFileName}.png`
                : `/enemies/${imgFileName}.png`;
        }
    }
}
</script>

<style>
    .battle-character {
        display: flex;
        justify-content: center;
        height: 100%;
    }

    .battle-character > img {
        position: absolute;
        bottom: 70px;
    }

    .p1-character {
        max-height: 75px;
    }

    .p2-character {
        max-height: 250px;
    }

</style>