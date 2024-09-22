import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
    chartData: null,
    chartData2: null,
    chartCache: [],
};

const getters = {
}

const mutations = {
  SET_CHART_DATA: (state, payload) => (state.chartData = payload),
  SET_CHART_DATA2: (state, payload) => (state.chartData2 = payload),

  RESET_CHART_CACHE: (state, payload) => (state.chartCache = payload),
  ADD_CHART_CACHE: (state, payload) => (state.chartCache = [...state.chartCache, payload]),
};

const actions = {
  async getChartData({ commit },{symbol}) {
    const resource = `${APP_CLOUD_FUNCTION_URL}/fool/historical?exchange=LSE&symbol=${symbol}&precision=Day&period=Max`
    try {
      const {data} = await axios.get(resource, { headers: APP_FINTECH_HEADERS })
      commit("SET_CHART_DATA", data)
    } catch(e) {
        console.log("getChartData",e)
        commit("SET_CHART_DATA", null)
    }
  },
  async getChartData2({ commit },{symbol}) {
    const resource = `${APP_CLOUD_FUNCTION_URL}/fool/historical2?exchange=LSE&symbol=${symbol}&precision=Day&period=Max`
    try {
      const {data} = await axios.get(resource, { headers: APP_FINTECH_HEADERS })
      console.log(data)
      commit("SET_CHART_DATA2", data)
    } catch(e) {
        console.log("getChartData2",e)
    }
  },
  async resetChartDataValues({ commit }) {
    commit("RESET_CHART_CACHE", [])
  },
  async getChartDataValues({ commit },{ symbol }) {
    const resource = `${APP_CLOUD_FUNCTION_URL}/fool/historical/values?exchange=LSE&symbol=${symbol}&precision=Day&period=Max`
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
