import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
    funddata: []
};

const getters = {}

const mutations = {
  SET_FUND_DATA: (state, payload) => (state.funddata = payload),
};

const actions = {
  async getFundData({ commit }) {
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/ft/funddata`, { headers: APP_FINTECH_HEADERS })
    commit("SET_FUND_DATA", data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
