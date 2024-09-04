import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
    chartData: {}
};

const getters = {}

const mutations = {
  SET_CHART_DATA: (state, payload) => (state.chartData = payload),
};

const actions = {
  async getChartData({ commit },{symbol}) {
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/fool/getdata?exchange=LSE&symbol=${symbol}&precision=Day&period=Max`, 
                                            { headers: APP_FINTECH_HEADERS })
    commit("SET_CHART_DATA", data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
