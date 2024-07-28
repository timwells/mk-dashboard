import axios from "axios";

import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
  indicators: [],
}

const getters = {
}

const mutations = {
    SET_INDICATORS: (state, payload) => (state.indicators = payload),
}
const actions = {
  async getIndicators({ commit }) {
    commit("SET_INDICATORS", []);

    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/cyca/indicators`, 
                                                                    { headers: APP_FINTECH_HEADERS })
    commit("SET_INDICATORS", data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}