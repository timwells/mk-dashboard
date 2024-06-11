import axios from "axios";
/*
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"
*/

const state = {
  etfs: null,
}

const getters = {
}

const mutations = {
    SET_ETFS: (state, payload) => (state.etfs = payload),
};

const actions = {
  async getETFs({ commit }) {
    commit("SET_ETFS", null);
    const { data } = await axios.get(`./data/allETFs.json`)
    commit("SET_ETFS",  data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}