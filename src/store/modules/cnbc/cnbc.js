import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL,
  APP_FINTECH_HEADERS,
} from "../common/c.js"
  
const state = {
  chartCache: [],
};
  
const getters = {
}
  
const mutations = {
  RESET_CHART_CACHE: (state, payload) => (state.chartCache = payload),
  ADD_CHART_CACHE: (state, payload) => (state.chartCache = [...state.chartCache, payload]),
};
  
const actions = {
  async getChartDataValues({ commit },{ symbol }) {
    console.log("getChartDataValues:",symbol)
    const resource = `${APP_CLOUD_FUNCTION_URL}/cnbc/historical/values?symbol=${symbol}&period=ALL`
    try {
      const {data} = await axios.get(resource, { headers: APP_FINTECH_HEADERS })
      console.log(data,symbol)
      commit("ADD_CHART_CACHE", data)
    } catch(e) {
        console.log("getChartDataValues",e)
    }
  },
  async resetChartDataValues({ commit }) {
    commit("RESET_CHART_CACHE", [])
  },
}
  
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
  