import { genericGet } from "../common/c.js"

const state = {
  nakedTrades: null,
  nakedArchives: [],
  nakedArchiveContent: "",
};

const getters = {}

const mutations = {
  SET_NAKED_TRADES: (state, payload) => (state.nakedTrades = payload),
  SET_NAKED_ARCHIVES: (state, payload) => (state.nakedArchives = payload),
  SET_NAKED_ARCHIVE_CONTENT: (state, payload) => (state.nakedArchiveContent = payload),    
};

const actions = {
  async getNakedTrades({ commit }) {
    // await genericGet(`/fintech/v1/scrape/nt/trades`,"SET_NAKED_TRADES",null,{commit})
    await genericGet(`/nt/trades`,"SET_NAKED_TRADES",null,{commit})
  },
  async getNakedArchives({ commit }) {
    await genericGet(`/nt/archives`,"SET_NAKED_ARCHIVES",[],{commit})
  },
  async getNakedArchiveContent({ commit },{ content }) {
    await genericGet(`/nt/archiveContent?a=${content}`,"SET_NAKED_ARCHIVE_CONTENT","",{commit})
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
