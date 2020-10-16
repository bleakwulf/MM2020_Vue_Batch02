<template>
    <div id="skills-panel">
        <div class="skills-inventory">
            <div class="skills-in-use">
                <div class="skills-in-use-title">Current Skills</div>
                <div v-for="( skill, idx ) in equippedSkills" 
                    :key="idx"
                    class="skill" 
                    :class="{ 'selected' : !!skill && isSelectedSkill(skill, 1) }"
                    @click="!!skill ? showSkillDetails(skill, 1) : null">
                    <div>{{ !!skill ? skill.name : '-----' }}</div>
                    <div>
                        <button type="button"
                            class="unequip-skill" 
                            title="Unequip this skill"
                            v-if="!!skill"
                            @click.prevent="unequipSkill(skill)">
                            <font-awesome-icon :icon="['fas', 'minus-circle']" size="sm" />
                        </button>
                    </div>
                </div>
            </div>
            <br />
            <div class="skills-available">
                <div class="skills-available-title">Available Skills</div>
                <div class="skills-list">
                    <div v-for="( skill, idx ) in availableSkills" 
                        :key="idx"
                        class="skill"
                        :class="{ 'selected' : !!skill && isSelectedSkill(skill, 2) }"
                        @click="showSkillDetails(skill, 2)">
                        <div>{{ skill.name}}</div>
                        <div>
                            <button type="button" 
                                class="equip-skill" 
                                :title="isFullSkillsSlot || !isCompatibleSkill(skill) ? '' : `Equip this skill` "
                                @click.prevent="equipSkill(skill)"
                                :disabled="isFullSkillsSlot || !isCompatibleSkill(skill)">
                                <font-awesome-icon :icon="['fas', 'plus-circle']" size="sm" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <br />
        </div>
        <div class="skills-details">
            <div v-if="!!selectedSkill"
                class="skill-card">
                <div class="header"> {{ selectedSkill.name }}</div>
                <div class="field-row">
                    <div>Level</div>
                    <div>{{ selectedSkill.lvlReq }}</div>
                </div>
                <div class="field-row">
                    <div>Type</div>
                    <div>{{ selectedSkill.type === 'P' ? 'Physical' : 'Magical' }}</div>
                </div>
                <div class="field-row">
                    <div>Cost</div>
                    <div>{{ `${selectedSkill.cost} mana` }}</div>
                </div>
                <div class="field-row">
                    <div>Target</div>
                    <div>{{ helpers.toProperCase(selectedSkill.target) }}</div>
                </div>
                <div class="field-row">
                    <div>{{ getEffectLabel(selectedSkill) }}</div>
                    <div>{{ getEffectDescription(selectedSkill) }}</div>
                </div>

                <div v-if="isSkillAvailable() && ( isFullSkillsSlot || !isCompatibleSkill(selectedSkill) )" 
                    class="fixed-bottom-action">
                    <span class="skill-warning">
                        <font-awesome-icon :icon="['fas', 'exclamation-triangle']" size="1x"/>
                    </span> {{ getSkillWarning() }}
                </div>

                <div v-if="isSkillAvailable() && !isFullSkillsSlot && isCompatibleSkill(selectedSkill)" 
                    class="fixed-bottom-action">
                    <button type="button" 
                        v-if="isSkillAvailable()"
                        @click="equipSkill(selectedSkill)"
                        class="equip">EQUIP</button>
                </div>

                <div v-if="!isSkillAvailable() && isCompatibleSkill(selectedSkill)" 
                    class="fixed-bottom-action">
                    <button type="button" 
                        v-if="!isSkillAvailable()"
                        @click="unequipSkill(selectedSkill)"
                        class="unequip">UNEQUIP</button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

//  helpers
import * as HELPERS from '../shared/helpers/Helpers.js'

export default {
    data() {
        return {
            selectedSkillSet: null,
            selectedSkill: null, 
            helpers: HELPERS
        }
    },

    methods: {
        ...mapActions([ 'loadCharacterData', 'loadSkills', 'updateSkills' ]),

        isCompatibleSkill: function(skill) {
            return skill.classId === this.getCharacterData.classType;
        }, 

        unequipSkill: async function(skill) {
            const payload = this.equippedSkills
                .filter( equippedSkill => !!equippedSkill ) // remove null skills used as padding
                .filter( equippedSkill => equippedSkill._id !== skill._id) 
                .map( equippedSkill => equippedSkill._id );

            await this.updateSkills(payload);
        }, 

        equipSkill: async function(skill) {
            const payload = [ 
                ...this.equippedSkills
                    .filter( equippedSkill => !!equippedSkill ) // remove null skills used as padding
                    .map( equippedSkill => equippedSkill._id ), 
                skill._id 
                ];
            await this.updateSkills(payload);
        }, 

        isSelectedSkill: function(skill, origin) {
            return (!!this.selectedSkill && skill._id === this.selectedSkill._id);
        }, 

        isSkillAvailable: function() {
            return this.availableSkills
                .map( skill => skill._id )
                .includes(this.selectedSkill._id);
        },

        showSkillDetails: function( skill, origin ) {
            this.selectedSkillSet = origin; // 1: equipped skills, 2: available skills
            this.selectedSkill = skill;
        },

        getSkillWarning() {
            return this.isFullSkillsSlot ? `Can't equip this item, your skill capacity is already full.`
                : !this.isCompatibleSkill(this.selectedSkill) ? `Can't equip skill, skill is not suited to your character class type.`
                : '';
        }, 

        getEffectLabel: function(skill) {
            return skill.target === 'self' ? 'Heal' : 'Damage';
        },

        getEffectDescription: function(skill) {
            let effectValue = skill.damage / 100;
            if (skill.target === 'self') effectValue = Math.abs(effectValue);
            return skill.type === 'M' ? `${effectValue}% of Intelligence` 
                : `${effectValue}% of Offense`;
        }
    },

    computed: {
        ...mapGetters([ 'getCharacterData', 'getSkillsInventory' ]), 

        equippedSkills: function() {
            const equippedSkillIds = this.getCharacterData.skills.map( skill => skill._id );
            const equippedSkills = !this.getSkillsInventory ? []
                    : this.getSkillsInventory.filter( skill => equippedSkillIds.includes(skill._id) );

            const equippedSkillsCount = equippedSkills.length;
            if (equippedSkillsCount < process.env.VUE_APP_MAX_SKILL_EQUIP) {
                equippedSkills.length = process.env.VUE_APP_MAX_SKILL_EQUIP;
                equippedSkills.fill(null, equippedSkillsCount);
            }

            return equippedSkills;

        }, 

        equippedSkillsCount: function() {
            const equippedSkillIds = this.getCharacterData.skills.map( skill => skill._id );

            const equippedSkills = !this.getSkillsInventory ? []
                    : equippedSkillIds.length === 0 ? []
                    : this.getSkillsInventory.filter( skill => equippedSkillIds.includes(skill._id) );

            return equippedSkills.length;
        }, 

        availableSkills: function() {
            const equippedSkillIds = this.getCharacterData.skills .map( skill => skill._id );
            return !this.getSkillsInventory ? []
                    : equippedSkillIds.length === 0 ? this.getSkillsInventory
                    : this.getSkillsInventory.filter( skill => !equippedSkillIds.includes(skill._id) );
        },

        isFullSkillsSlot: function() {
            return this.equippedSkillsCount >= process.env.VUE_APP_MAX_SKILL_EQUIP;
        }

    },

    async created() {
        this.loadCharacterData();
        await this.loadSkills()
            .then( res => {
                this.selectedSkill = this.equippedSkills.length > 0 ? this.equippedSkills[0]
                    : this.availableSkills > 0 ? this.availableSkills[0]
                    : null;
            });
    }

}
</script>

<style scoped> 
    #skills-panel {
        display: flex;
        flex-flow: row nowrap;
    }

    .skills-inventory {
        flex: 1;
        margin-right: 10px;
    }

    .skill-card {
        text-align: center;
        padding: 20px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        text-align: center;
        position: relative;
        height: 100%;
    }

    .skills-details {
        flex: 1;
        border-radius: 10px;
        background: #ffffff;
        margin-bottom: 22px;
        margin-left: 10px;
        margin-right: 5px;
        box-shadow: inset 5px 5px 25px #d9d9d9, 
                    inset -5px -5px 25px #ffffff, 
                    20px 20px 40px #d9d9d9, 
                    -20px -20px 40px #ffffff;
        border: 1px solid #ffffff;
        padding: 20px 30px;
    }
    
    .header {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 1.25rem;
        margin-bottom: 10px;
    }

    .field-row {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        text-align: left; 
        font-size: 14px;
        margin-bottom: 3px;
        padding: 6px 0;
        border-bottom: 0.5px solid #f2f3f4;
    }
    
    .field-row div:first-child {
        width: 125px;
        justify-content: flex-start;
        padding-left: 10px;
    }
    
   .field-row div:last-child {
        flex: 1;
        justify-content: flex-start;
        font-weight: 500;
    }

    .skills-in-use, 
    .skills-available {
        border-radius: 10px;
        background: #ffffff;
        box-shadow:  20px 20px 60px #ad9d9d, 
                    -20px -20px 60px #ffffff;
        padding: 20px 30px;
        border: 0.5px solid #ffffff;
    }
    .skills-in-use-title, 
    .skills-available-title {
        font-size: 1rem;
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;
        padding-bottom: 5px;
        border-bottom: 1px solid seagreen;
        margin-bottom: 10px;
    }

    .skills-available {
        height: 200px;
    }

    .skills-list {
        overflow-y: scroll;
        height: 110px;
    }
    
    .skills-list::-webkit-scrollbar {
        width: 5px !important;
    }

    .skills-list::-webkit-scrollbar-thumb {
        background-color: lightgrey !important;
        border-radius: 5px !important;
    }

    .skills-list::-webkit-scrollbar-track {
        background: transparent !important;
    }

    .skill {
        text-align: center;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        padding: 0 20px;
    }
    
    .skill div:first-child {
        font-weight: 500;
    }

    .skill:nth-child(even) {
        background-color: #f5f5f5;
    }
    
    .skill:hover,
    .skill:nth-child(even):hover {
        background-color: #ffffe0;
    }
      
    .skill.selected, 
    .skill.selected:hover,
    .skill:nth-child(odd).selected:hover {
        background-color: #fdfd96;
    }

    .unequip-skill { 
        color: red;
        background: transparent;
        border: 0;
    }
    .equip-skill { 
        color: green;
        background: transparent;
        border: 0;
    }
    
    .equip-skill:disabled { 
        color: grey;
        cursor: not-allowed;
    }
    
    .equip-skill:focus, 
    .equip-skill:disabled:focus, 
    .unequip-skill:focus {
        outline: 0;
    }

    .fixed-bottom-action {
        position: absolute;
        bottom: 20px;
        font-weight: 500;
        text-align: center;
        width: 100%;
        right: 0;
    }

    .fixed-bottom-action button {
        border: 0;
        background: linear-gradient(145deg, #ffffff, #e6e6e6);
        box-shadow: 12px 12px 37px #a1a1a1, 
                    -12px -12px 37px #ffffff;
        padding: 13px 20px;
        border-radius: 15px;
        min-width: 150px;
        font-weight: bold;
        color: #a0a0a0;
    }

    .fixed-bottom-action button:active {
        background: linear-gradient(145deg, #e6e6e6, #ffffff);
    }

    .fixed-bottom-action button.equip:active,
    .fixed-bottom-action button.equip:hover {
        color: #00E800;
    }
    
    .fixed-bottom-action button.unequip:active,
    .fixed-bottom-action button.unequip:hover {
        color: #F80000;
    }

    .skill-warning {
        color: goldenrod;
    }

    .fixed-bottom-action button:focus {
        outline: none;
    }
</style>