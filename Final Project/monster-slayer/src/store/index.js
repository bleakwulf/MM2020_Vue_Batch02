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
    inventory: null, 
    dungeons: null, 
};

const getters = {
    getUser:  state => state.user,
    getAccountId: state => state.accountId
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
                return;
            }).catch( err => {
                console.log('Error enountered while performing validation of login credentials.', err);
                throw err;
            })
    },

    async loadUserData({ commit, state }) {
        return await axios.get(`${BASE_URL}accounts/${state.accountId}/character`)
            .then( res => {
                commit( MUTATION_TYPES.SET_USER, res.data );
            });
    }, 

    loadCharacterData({ commit }, payload ) {
        const { characterId } = payload.data;
        axios.get(`${BASE_URL}character/${characterId}`)
        .then( res => { 
            commit( MUTATION_TYPES.SET_CHARACTER_DATA, res.data );
        });
    }, 

    loadInventory({ commit }, payload ) {
        const { characterId } = payload.data;
        axios.get(`${BASE_URL}character/${characterId}/inventory`)
        .then( res => { 
            commit( MUTATION_TYPES.SET_DUNGEONS_LIST, res.data );
        });
    },

    loadDungeons({ commit }) {
        axios.get(`${BASE_URL}dungeons`)
        .then( res => { 
            commit( MUTATION_TYPES.SET_DUNGEONS_LIST, res.data );
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

    [MUTATION_TYPES.SET_INVENTORY] (state, payload) {
        state.inventory = payload;
    },

    [MUTATION_TYPES.SET_DUNGEONS_LIST] (state, payload) {
        state.dungeons = payload.dungeons;
    }
}

export default new Vuex.Store({
    state, 
    getters, 
    actions, 
    mutations, 
});
