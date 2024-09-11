import { genericGet } from "../common/c.js"

const state = {
  wilshireGdpRatio: null,
  sp500vsBondsRatio: null,
  thumbnails: []
};

const getters = {}
const mutations = {
  SET_WILSHIRE_GDP_RATIO: (state, payload) => (state.wilshireGdpRatio = payload),
  SET_SP500_VS_BONDS_RATIO: (state, payload) => (state.sp500vsBondsRatio = payload),
  SET_THUMBNAILS: (state, payload) => (state.thumbnails = payload),
};

/*
https://www.longtermtrends.net/data-wilshire-gdp-ratio/
https://www.longtermtrends.net/data-equities-gdp-ratio/
https://www.longtermtrends.net/data-gdp/
https://www.longtermtrends.net/data-dow-gdp-ratio/
ltt/longtermtrends?dataset=data-wilshire-gdp-ratio
*/
const actions = {
  /*
  async getWilshireGdpRatio({ commit }) {
    await genericGet(`/fintech/v1/scrape/ltt/longtermtrends?dataset=data-wilshire-gdp-ratio`,
                            "SET_WILSHIRE_GDP_RATIO",null,{commit})
  },
  async getSP500VsBondsRatio({ commit }) {
    await genericGet(`/fintech/v1/scrape/ltt/longtermtrends?dataset=data-sp500-to-bonds-ratio`,
                            "SET_SP500_VS_BONDS_RATIO",null,{commit})
  },
  */
  async getThumbNails({ commit }) {
    await genericGet(`/ltt/thumbnails`,"SET_THUMBNAILS",[],{commit})
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
