import axios from "axios";

const state = {
  watchlist: []
};

const getters = {
}

const mutations = {
  SET_WATCHLIST: (state, payload) => (state.watchlist = payload)
};

const actions = {
  getWatchList({ commit }) {
    commit("SET_WATCHLIST", []);
    axios.get(`./data/tradewatchlist.json`).then(response => {
      commit("SET_WATCHLIST", response.data);
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

