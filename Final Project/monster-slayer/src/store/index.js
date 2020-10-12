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
};

const getters = {
    getUser:  state => state.user,
    getAccountId: state => state.accountId,
    getCharacterData: state => state.characterData, 
    getCharacterStats: state => state.user.stats, 
    getComputedStats: state => state.computedStats,
    getSkillsInventory: state => state.skillsInventory, 
    getDungeons: state => state.dungeons
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
                commit( MUTATION_TYPES.SET_DUNGEONS_LIST, res.data );
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
    }
}

export default new Vuex.Store({
    state, 
    getters, 
    actions, 
    mutations, 
});
