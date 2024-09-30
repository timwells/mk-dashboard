import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
    mymapfunds: [],
    dataset: [],
    chartCache: [],
};

const getters = {}

const mutations = {
  SET_MYMAPFUNDS: (state, payload) => (state.mymapfunds = payload),
  RESET_CHART_CACHE: (state, payload) => (state.chartCache = payload),
  ADD_CHART_CACHE: (state, payload) => (state.chartCache = [...state.chartCache, payload]),
};

const actions = {
  async getMyMapfunds({ commit }) {
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/ft/mymapfunds`, { headers: APP_FINTECH_HEADERS })
    commit("SET_MYMAPFUNDS", data)
  },

  async resetChartDataValues({ commit }) {
    commit("RESET_CHART_CACHE", [])
  },

  async getChartDataValues({ commit },{ symbol }) {
    const resource = `${APP_CLOUD_FUNCTION_URL}/ft/historical/series?ticker=${symbol}`
    try {
      const {data} = await axios.get(resource, { headers: APP_FINTECH_HEADERS })
      commit("ADD_CHART_CACHE", data)
    } catch(e) {
        console.log("getChartDataValues",e)
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
