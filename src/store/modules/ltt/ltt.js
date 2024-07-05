import { genericGet } from "../common/c.js"

const state = {
  wilshireGdpRatio: null,
};

const getters = {}
const mutations = {
  SET_WILSHIRE_GDP_RATIO: (state, payload) => (state.wilshireGdpRatio = payload),
};

/*
https://www.longtermtrends.net/data-wilshire-gdp-ratio/
https://www.longtermtrends.net/data-equities-gdp-ratio/
https://www.longtermtrends.net/data-gdp/
https://www.longtermtrends.net/data-dow-gdp-ratio/
ltt/longtermtrends?dataset=data-wilshire-gdp-ratio

*/
const actions = {
  async getWilshireGdpRatio({ commit }) {
    await genericGet(`/fintech/v1/scrape/ltt/longtermtrends?dataset=data-wilshire-gdp-ratio`,
                            "SET_WILSHIRE_GDP_RATIO",null,{commit})
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
