import axios from "axios";

const API_KEY = process.env.VUE_APP_FINTECH_API_KEY;
const HEADERS = { 'x-api-key' : API_KEY }

const state = {
  trades: []
};

const getters = {}

const mutations = {
  SET_TRADES: (state, payload) => (state.trades = payload)
};

const actions = {
  getNakedTrades({ commit }) {
    commit("SET_TRADES", []);
    axios.get('https://us-central1-mk-d-b59f2.cloudfunctions.net/fintech/v1/scrape/nt',{ headers: HEADERS })
        .then(response => {
            commit("SET_TRADES", response.data);
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
