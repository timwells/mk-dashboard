import axios from "axios";
import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
    mymapfunds: []
};

const getters = {}

const mutations = {
  SET_MYMAPFUNDS: (state, payload) => (state.mymapfunds = payload),
};

const actions = {
  async getMyMapfunds({ commit }) {
    const {data} = await axios.get(`${APP_CLOUD_FUNCTION_URL}/ft/mymapfunds`, { headers: APP_FINTECH_HEADERS })
    commit("SET_MYMAPFUNDS", data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
