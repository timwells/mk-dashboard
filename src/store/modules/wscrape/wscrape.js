import axios from "axios";

const API_KEY = process.env.VUE_APP_FINTECH_API_KEY;
const HEADERS = { 'x-api-key' : API_KEY }

const state = {
  nakedtrades: [],
  dataroma: [],
  dataromaHoldings: []
};

const getters = {}

const mutations = {
  SET_NAKED_TRADES: (state, payload) => (state.nakedtrades = payload),
  SET_DATAROMA: (state, payload) => (state.dataroma = payload),
  SET_DATAROMA_HOLDINGS: (state, payload) => (state.dataromaHoldings = payload),
};

const actions = {
  getNakedTrades({ commit }) {
    commit("SET_NAKED_TRADES", []);
    axios.get('https://us-central1-mk-d-b59f2.cloudfunctions.net/fintech/v1/scrape/nt',{ headers: HEADERS })
        .then(response => {
            commit("SET_NAKED_TRADES", response.data);
        })
  },
  getDataroma({ commit }) {
    commit("SET_DATAROMA", []);
    axios.get('https://us-central1-mk-d-b59f2.cloudfunctions.net/fintech/v1/scrape/dataroma',{ headers: HEADERS })
        .then(response => {
            commit("SET_DATAROMA", response.data);
        })
  },
  getDataromaHoldings({ commit }, { q }) {
    console.log(q)
    commit("SET_DATAROMA_HOLDINGS", []);
    axios.get(`https://us-central1-mk-d-b59f2.cloudfunctions.net/fintech/v1/scrape/dataroma?q=${q}`,{ headers: HEADERS })
        .then(response => {
            commit("SET_DATAROMA_HOLDINGS", response.data);
        })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
