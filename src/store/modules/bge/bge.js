import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
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
  async resetChartDataValues({ commit }) {
    commit("RESET_CHART_CACHE", [])
  },

  async getChartDataValues({ commit },{path}) {
    const resource = `${APP_CLOUD_FUNCTION_URL}/bge/historical/values?path=${path}`
    try {
      const { data } = await axios.get(resource, { headers: APP_FINTECH_HEADERS })
      console.log("getChartDataValues",path,data)
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
