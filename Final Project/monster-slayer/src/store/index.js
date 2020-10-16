import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

import { MUTATION_TYPES } from './mutation-types'

Vue.use(Vuex);

const BASE_URL = `${process.env.VUE_APP_API_BASEURL}`;

const state = {
    user: null, 
    accountId: null, 
    characterData: null, 
    computedStats: null,
    inventory: null, 
    skillsInventory: null, 
    dungeons: null, 
    matchData: null,
};

const getters = {
    getUser:            state => state.user,
    getAccountId:       state => state.accountId,
    getCharacterData:   state => state.characterData, 
    getCharacterStats:  state => state.user.stats, 
    getComputedStats:   state => state.computedStats,
    getSkillsInventory: state => state.skillsInventory, 
    getInventory:       state => state.inventory, 
    getDungeons:        state => state.dungeons,
    getMatchData:       state => state.matchData
};

const actions = {
    async register({ commit }, payload ) {
        return await axios.post(`${BASE_URL}accounts`, payload )
            .then( res => {
                 return res.data;
            }).catch( err => {
                console.log(`Oops! Error encountered while attempting to register.`);
                throw err;
            });
    },

    async validateCredential({ commit }, payload ) {
        await axios.post(`${BASE_URL}accounts/login`, payload )
            .then( res => {
                commit( MUTATION_TYPES.SET_ACCOUNT_ID, res.data );
            }).catch( err => 
                console.log('Error enountered while performing validation of login credentials.', err)
            );
    },

    async login({ commit, dispatch }, payload ) {
        await dispatch('validateCredential', payload );
        return await dispatch('loadUserData')
            .then( res => {
                dispatch('loadComputedStats');
                return;
            }).catch( err => {
                console.log('Error enountered while performing validation of login credentials.', err);
                throw err;
            })
    },

    async loadUserData({ commit, state }) {
        return await axios.get(`${BASE_URL}accounts/${state.accountId}/character`)
            .then( res => {
                //  per checking, responses from /accounts/:accountid/character and /character/:characterid were congruent
                //  as such, init state.characterdata as state.user
                //  modify implementation if previous findings on congruent response no longer holds true
                commit( MUTATION_TYPES.SET_USER, res.data );
                commit( MUTATION_TYPES.SET_CHARACTER_DATA, res.data );
            });
    }, 

    async logout({ commit }) {
        await commit( MUTATION_TYPES.LOGOUT_USER );
    }, 

    async loadCharacterData({ commit, dispatch, state } ) {
        const { user: { _id: characterId } } = state;
        return await axios.get(`${BASE_URL}character/${characterId}`)
        .then( res => { 
            commit( MUTATION_TYPES.SET_CHARACTER_DATA, res.data );
            dispatch('loadComputedStats');
            return;
        }).catch( err =>{
            console.log(err);
        });
    }, 

    async loadComputedStats({ commit, state }) {
        const { stats, equipment: { weapon: { bonus: weaponBonus }, armor: { bonus: armorBonus } } } = state.characterData;

        const computedStats = Object.assign({}, stats);

        Object.keys(computedStats).forEach( attr => {
            computedStats[attr] += weaponBonus[attr] + armorBonus[attr];
        });
        commit( MUTATION_TYPES.SET_COMPUTED_STATS, computedStats )
    },
    
    async loadSkills({ commit, state } ) {
        const { user: { _id: characterId } } = state;
        await axios.get(`${BASE_URL}character/${characterId}/skills`)
            .then( res => { 
                commit( MUTATION_TYPES.SET_SKILLS_INVENTORY, res.data );
                return;
            });
    },

    async loadInventory({ commit }, payload ) {
        const { user: { _id: characterId } } = state;
        await axios.get(`${BASE_URL}character/${characterId}/inventory`)
            .then( res => { 
                commit( MUTATION_TYPES.SET_INVENTORY, res.data );
                return;
            });
    },

    async loadDungeons({ commit }) {
        const { user: { _id: characterId } } = state;
        await axios.get(`${BASE_URL}character/${characterId}/dungeons`)
            .then( res => { 
                commit( MUTATION_TYPES.SET_DUNGEONS_LIST, res.data );
                return;
            });
    },

    async enterDungeon({ commit, dispatch, state }, payload ) {
        const { dungeonId } = payload;

        // reload computed stats for integrity, e.g., level up at end of last match and confirmed re-entering the dungeon 
        await dispatch('loadCharacterData', payload );
        return await axios.post(`${BASE_URL}dungeons/enter`, {
                characterId: state.characterData._id,
                dungeonId
            }).then( res => {
                const { dungeon, enemy } = res.data;
                const { skills, _id, name, level, classType } = state.characterData;

                console.log(process.env.VUE_APP_APPLY_MP_HANDICAP);
                console.log(process.env.VUE_APP_MP_HANDICAP_LIMIT);
                
                let p2 = Object.assign( {}, enemy);
                p2.stats = { ...enemy.stats, 
                    mana: process.env.VUE_APP_APPLY_MP_HANDICAP 
                        ? enemy.stats.mana * process.env.VUE_APP_MP_HANDICAP_LIMIT / 100 
                        : enemy.stats.mana, 
                    maxHp: enemy.stats.health,
                    maxMp: enemy.stats.mana
                }
                
                const matchData = {
                    dungeon,
                    p1: {
                        stats: {
                            ...state.computedStats, 
                            mana: process.env.VUE_APP_APPLY_MP_HANDICAP 
                                ? state.computedStats.mana * process.env.VUE_APP_MP_HANDICAP_LIMIT / 100 
                                : state.computedStats.mana, 
                            maxHp: state.computedStats.health,
                            maxMp: state.computedStats.mana
                        }, 
                        skills, 
                        _id, 
                        name, 
                        level, 
                        classType
                    },
                    p2, 
                    povTurn: 1  // player 1 has default turn
                };

                commit( MUTATION_TYPES.SET_MATCH_DATA, matchData );
                return;
            })
    },
    
    async updateSkills({ commit, dispatch, state }, payload ) {
        const { user: { _id: characterId } } = state;
        await axios.put(`${BASE_URL}character/${characterId}/skills`, payload)
            .then( res => { 
                dispatch('loadCharacterData');
                return;
            });
    },

    async processSkillMove({ commit, dispatch, state }, payload) {
        console.log(payload)
        const { povSource, skillWielded } = payload;

        //  identify skill wielder and target 
        const isTargetSelf = skillWielded.target === 'self';
        const isFocusSkill = isTargetSelf && skillWielded._id.endsWith('__FOCUS' );
        const p1 = Object.assign({}, povSource === 1 ? state.matchData.p1.stats : state.matchData.p2.stats);
        // const p2 = isTargetSelf ? null  // Object.assign({}, p1) 
        //     : Object.assign({}, povSource === 1 ? state.matchData.p2.stats : state.matchData.p1.stats);
        const p2 = Object.assign({}, povSource === 1 ? state.matchData.p2.stats : state.matchData.p1.stats);

        //  calculate base damage
        const baseDamage = skillWielded.type === 'P' ? ( skillWielded.damage / 100 ) * p1.off   // physical attacks as % of wielder' offense
            : isFocusSkill ? p1.int * process.env.VUE_APP_FOCUS_GAIN_PERCENTAGE / 100           // focus as default % from wielder' intelligence
            : ( skillWielded.damage / 100 ) * p1.int;                                           // magical attacks as % of wielder' intelligence

        //  check luck factor for critical hit
        const isHitSuccess = isTargetSelf ? true                        // self-targetted skill never fails
            : Math.random() < (p1.agi / 100) * (baseDamage / 100);      // TO DO: further formulate chance to land hit

        const isCriticalHit = isTargetSelf ? false 
            : Math.random() < p1.luk;
        
        //  calculate enemy evasion factors using their stats.agi
        //  NOTE: enemy can only evade magical attacks thru their luck factor
        const p2LuckFactor = isTargetSelf ? false 
            : Math.random() < p2.luk;
        const p2EvadeFactor = isTargetSelf ? false :
            Math.random() <= (p2.agi / 100) * (baseDamage / 100);   // TO DO: further formulate chance to evade physical attack
        const isEvade = isTargetSelf ? false
            : skillWielded.type === 'M' ? p2LuckFactor : p2EvadeFactor; 

        const defenseFactor = isTargetSelf || isEvade ? 0                       // no need to calculate if target is self or enemy can evade attack
            : skillWielded.type === 'P' ? (p2.health / p2.maxHp) * p2.def       // defense as % of target's physical constitution
            : (p2.mana / p2.maxMp) * p2.def;                                    // defense as % of target's mana constitution

        // calculate total damage
        const totalDamage = (isHitSuccess && !isEvade) 
            ? Math.ceil(
                ( isCriticalHit ? baseDamage * process.env.VUE_APP_LUCK_MULTIPLIER : baseDamage ) 
                - ( defenseFactor < 0 ? 0 : defenseFactor )
            ) : 0;

        //  calculate effect
        p1.mana     -= isTargetSelf && isFocusSkill ? 0 - baseDamage : skillWielded.cost;
        p1.health   += isTargetSelf && !isFocusSkill ? Math.abs(baseDamage) : 0;
        p2.health   -= !isTargetSelf ? baseDamage : 0;

        //  clear out of bound stats
        p1.mana     = p1.mana < 0   ? 0 : p1.mana > p1.maxMp    ? p1.maxMp : p1.mana;
        p1.health   = p1.health < 0 ? 0 : p1.health > p1.maxHp  ? p1.maxHp : p1.health;
        p2.health   = p2.health < 0 ? 0 : p2.health > p2.maxHp  ? p2.maxHp : p2.health;

        //  identify end game and/or turn switch
        const isEndGame = p1.health === 0 || p2.health === 0;
        const povTurn = isEndGame ? 0
            : povSource === 1 ? 2 : 1;

        //  return skill result
        const newPayload = {
            p1: povSource === 1 ? 
                {
                    mana: p1.mana,
                    health: p1.health
                } : {
                    health: p2.health
                }, 
            p2: povSource === 2 ? 
                {
                    mana: p1.mana,
                    health: p1.health
                } : {
                    health: p2.health
                },
            povTurn
        }

        commit( MUTATION_TYPES.SET_SKILLS_EFFECT, newPayload );
    }

};

const mutations = {
    [MUTATION_TYPES.SET_ACCOUNT_ID] ( state, payload ) {
        state.accountId = payload.accountId;
    },

    [MUTATION_TYPES.SET_USER] ( state, payload ) {
        state.user = payload;
    },

    [MUTATION_TYPES.LOGOUT_USER] ( state ) {
        state.user = null;
        state.accountId = null;
    },

    [MUTATION_TYPES.SET_CHARACTER_DATA] (state, payload) {
        state.characterData = payload;
    },

    [MUTATION_TYPES.SET_COMPUTED_STATS] (state, payload) {
        state.computedStats = payload;
    },

    [MUTATION_TYPES.SET_INVENTORY] (state, payload) {
        state.inventory = payload;
    },

    [MUTATION_TYPES.SET_SKILLS_INVENTORY] (state, payload) {
        state.skillsInventory = payload;
    },

    [MUTATION_TYPES.SET_DUNGEONS_LIST] (state, payload) {
        state.dungeons = payload;
    }, 

    [MUTATION_TYPES.SET_MATCH_DATA] (state, payload) {
        state.matchData = payload;
    }, 

    [MUTATION_TYPES.SET_SKILLS_EFFECT] (state, payload) {
        const { p1: p1Stats, p2: p2Stats, povTurn } = payload;

        if (typeof p1Stats.mana !== 'undefined')   state.matchData.p1.stats.mana   = p1Stats.mana;
        if (typeof p1Stats.health !== 'undefined') state.matchData.p1.stats.health = p1Stats.health;
        if (typeof p2Stats.mana !== 'undefined')   state.matchData.p2.stats.mana   = p2Stats.mana;
        if (typeof p2Stats.health !== 'undefined') state.matchData.p2.stats.health = p2Stats.health;
              
        state.matchData.povTurn = povTurn;

    }
}

export default new Vuex.Store({
    state, 
    getters, 
    actions, 
    mutations, 
});
