import axios from "axios";

import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
  dataset: null,
}

const getters = {
}

const mutations = {
    SET_DATASET: (state, payload) => (state.dataset = payload),
};
const actions = {
  async getDataSet({ commit },{ dataset }) {
    commit("SET_DATASET", null);
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/curvo?dataset=${dataset}`, 
                                        { headers: APP_FINTECH_HEADERS })

    commit("SET_DATASET", data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}