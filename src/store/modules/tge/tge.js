import { genericGet } from "../common/c.js"

const state = {
  commodities: [],
};

const getters = {}

const mutations = {
  SET_COMMODITIES: (state, payload) => (state.commodities = payload),
};

const actions = {
  async getCommodities({ commit }) {
    await genericGet(`/fintech/v1/scrape/tge/commodities`,"SET_COMMODITIES",[],{commit})
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
