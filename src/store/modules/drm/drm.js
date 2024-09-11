import axios from "axios";

import {
  APP_CLOUD_FUNCTION_URL, 
  APP_FINTECH_HEADERS,
  genericGet
} from "../common/c.js"

const state = {
  portfolio: [],
  holdingsMap: [],
};

const getters = {
  holdings: (state) => (investor) => state.holdingsMap.find((holding) => (holding.investor === investor)),
}

const mutations = {
  SET_PORTFOLIO: (state, payload) => (state.portfolio = payload),
  SET_HOLDINGS_MAP: (state, payload) => (state.holdingsMap.push(payload)),
};

const actions = {
  async getPortfolio({ commit }) {
    await genericGet(`/drm/portfolio`,"SET_PORTFOLIO",[],{commit})
  },
  async getHoldings({ commit }, { investor }) {
    const resource = `${APP_CLOUD_FUNCTION_URL}/drm/holdings?investor=${investor}`
    const {data } = await axios.get(resource,{ headers: APP_FINTECH_HEADERS })
    commit("SET_HOLDINGS_MAP", { investor: investor, data: data })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
