import axios from "axios";
import {
    APP_CLOUD_FUNCTION_URL, 
    APP_FINTECH_HEADERS,
} from "../common/c.js"

const state = {
    financials: null,
};

const getters = {}

const mutations = {
  SET_FINANCIALS: (state, payload) => (state.financials = payload),
};

const actions = {
    async getFinancials({ commit }, { exchange, symbol }) {
      console.log(`getFinancials: ${exchange}, ${symbol}`);
      axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/sa/financials?exchange=${exchange}&symbol=${symbol}`,{ headers: APP_FINTECH_HEADERS })
        .then(response => { commit("SET_FINANCIALS", response.data) })
      },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
