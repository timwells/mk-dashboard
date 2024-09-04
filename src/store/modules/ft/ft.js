import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
    funddata: [],
    funddata2: []
};

const getters = {}

const mutations = {
  SET_FUND_DATA: (state, payload) => (state.funddata = payload),
  SET_FUND_DATA2: (state, payload) => (state.funddata2 = payload),
};

const actions = {
  async getFundData({ commit }) {
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/ft/funddata`, { headers: APP_FINTECH_HEADERS })
    commit("SET_FUND_DATA", data)
  },
  async getFundData2({ commit }) {
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/ft/funddata2`, { headers: APP_FINTECH_HEADERS })
    commit("SET_FUND_DATA2", data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
