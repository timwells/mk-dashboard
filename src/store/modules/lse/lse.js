import axios from "axios";

import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
  sectorPerformance: null,
  constituentsPerformance : [],
  constituentsDetails: [],
  brokerRatings: []
}

const getters = {
  gConstituents: (state) => (tag) => state.constituentsPerformance.find((e) => (e.tag === tag)),
  gConstituentDetails: (state) => (epic) => state.constituentsDetails.find((e) => (e.epic === epic)),
  gBrokerRatings: (state) => (epic) => state.brokerRatings.find((e) => (e.tag === epic)) 
}

const mutations = {
    SET_SECTOR_PERFORMANCE: (state, payload) => (state.sectorPerformance = payload),
    SET_CONSTITUENT_PERFORMANCE: (state, payload) => (state.constituentsPerformance.push(payload)),
    SET_CONSTITUENT_PERFORMANCE_ITEM: (state, payload) => {
      let index = state.constituentsPerformance.findIndex((e) => (e.tag === payload.constituents))
      if (index !== -1) { state.constituentsPerformance[index] =  {tag: "DELETED"}; }
      return state.constituentsPerformance
    },

    SET_CONSTITUENT_DETAILS: (state, payload) => (state.constituentsDetails.push(payload)),
    SET_BROKER_RATINGS: (state, payload) => (state.brokerRatings.push(payload)),
};
const actions = {
  async getSectorPeformance({ commit },{ live }) {
    commit("SET_SECTOR_PERFORMANCE", null);
    const {data} = await 
        axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/lse/sectorpeformance?live=${live}`, { headers: APP_FINTECH_HEADERS })

      commit("SET_SECTOR_PERFORMANCE", data)
  },
  async getConstituentsPeformance({ commit },{ constituents, live }) {
    if(live) commit("SET_CONSTITUENT_PERFORMANCE_ITEM",{constituents}) // Clear exist
    const {data} = await 
      axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/lse/constituentperformance?constituents=${constituents}&live=${live}`, { headers: APP_FINTECH_HEADERS })
    commit("SET_CONSTITUENT_PERFORMANCE", data)
  },
  async getConstituentDetails({ commit },{ epic }) {
    const {data} = await 
      axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/lse/constituentdetails?epic=${epic}`, { headers: APP_FINTECH_HEADERS })
      commit("SET_CONSTITUENT_DETAILS", data)
  },
  async getBrokerRatings({ commit },{ epic }) {
    const {data} = await 
      axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/lse/brokerratings?epic=${epic}`, { headers: APP_FINTECH_HEADERS })
      commit("SET_BROKER_RATINGS", data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}