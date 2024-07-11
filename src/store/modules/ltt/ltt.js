import { genericGet } from "../common/c.js"

const state = {
  wilshireGdpRatio: null,
  sp500vsBondsRatio: null
};

const getters = {}
const mutations = {
  SET_WILSHIRE_GDP_RATIO: (state, payload) => (state.wilshireGdpRatio = payload),
  SET_SP500_VS_BONDS_RATIO: (state, payload) => (state.sp500vsBondsRatio = payload),
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
  async getSP500VsBondsRatio({ commit }) {
    await genericGet(`/fintech/v1/scrape/ltt/longtermtrends?dataset=data-sp500-to-bonds-ratio`,
                            "SET_SP500_VS_BONDS_RATIO",null,{commit})
  },
  //https://www.longtermtrends.net/data-sp500-to-bonds-ratio/
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
