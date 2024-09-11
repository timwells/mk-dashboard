import {
  genericGet
} from "../common/c.js"

const state = {
  dividendData: [],
};

const getters = {
}

const mutations = {
  SET_DIVIDEND_DATA: (state, payload) => (state.dividendData = payload),
};

const actions = {
  async getDividendData({ commit }) {
    await genericGet(`/dd/exdividenddate`,"SET_DIVIDEND_DATA",[],{commit})
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
