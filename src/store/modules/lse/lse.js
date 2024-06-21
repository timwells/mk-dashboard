import axios from "axios";

import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
  sectorPerformance: null,  
}

const getters = {
}

const mutations = {
    SET_SECTOR_PERFORMANCE: (state, payload) => (state.sectorPerformance = payload),
};

const actions = {
  async getSectorPeformance({ commit }) {
    commit("SET_SECTOR_PERFORMANCE", null);

    const {data} = await 
        axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/lse/sectorpeformance`, { headers: APP_FINTECH_HEADERS })


    commit("SET_SECTOR_PERFORMANCE", data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}