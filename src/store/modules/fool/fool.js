import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
    chartData: null
};

const getters = {}

const mutations = {
  SET_CHART_DATA: (state, payload) => (state.chartData = payload),
};

const actions = {
  async getChartData({ commit },{symbol}) {
    const resource = `${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/fool/getdata?exchange=LSE&symbol=${symbol}&precision=Day&period=Max`
    try {
      const {data} = await axios.get(resource, { headers: APP_FINTECH_HEADERS })
      commit("SET_CHART_DATA", data)
    } catch(e) {
        console.log("getChartData",e)
        commit("SET_CHART_DATA", null)
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
