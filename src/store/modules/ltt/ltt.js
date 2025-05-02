import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"


// https://www.longtermtrends.net/community/api/comments/dow-gold-ratio/
// https://www.longtermtrends.net/data-dow-gold-ratio/
// https://www.longtermtrends.net/data-dow-since-1789/
// https://www.longtermtrends.net/data-gold-since-1792/

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

  async getChartDataValues(
      { commit },
      { datasetname}
  ) {
    const parameters = `datasetname=${datasetname}`
    const resource = `${APP_CLOUD_FUNCTION_URL}/llt/historical/values?${parameters}`
    try {
      const { data } = await axios.get(resource, { headers: APP_FINTECH_HEADERS })
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
