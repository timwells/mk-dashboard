import axios from "axios";

import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
  sectorPerformance: null,
  constituentsPerformance : []
}

const getters = {
  gConstituents: (state) => (tag) => state.constituentsPerformance.find((e) => (e.tag === tag)),
  gConstituents2: (state) => (tag) => {
    console.log(state.constituentsPerformance.find((e) => (e.tag === tag)))
    return state.constituentsPerformance.find((e) => (e.tag === tag))
  },
}

const mutations = {
    SET_SECTOR_PERFORMANCE: (state, payload) => (state.sectorPerformance = payload),
    SET_CONSTITUENT_PERFORMANCE: (state, payload) => (state.constituentsPerformance.push(payload)),
};

const actions = {
  async getSectorPeformance({ commit }) {
    commit("SET_SECTOR_PERFORMANCE", null);
    const {data} = await 
        axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/lse/sectorpeformance`, { headers: APP_FINTECH_HEADERS })
    commit("SET_SECTOR_PERFORMANCE", data)
  },
  async getConstituentsPeformance({ commit },{ constituents }) {
    const {data} = await 
        axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/lse/constituentperformance?constituents=${constituents}`, { headers: APP_FINTECH_HEADERS })

    console.log(data)
        commit("SET_CONSTITUENT_PERFORMANCE", data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}