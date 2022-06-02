import axios from "axios";

const state = {
  markets: null
};

const getters = {
/*
  polygonIntersectionBins(state) {
    let stats = { categories: [], data: [] };
    if (state.statsData) {
      state.statsData.PolygonIntersectionBins.map(m => {
        stats.categories.push(m.range), stats.data.push(m.count);
      });
    }
    return stats;
  },
  polygonPointBins(state) {
    let stats = { categories: [], data: [] };
    if (state.statsData) {
      state.statsData.PolygonPointBins.map(m => {
        stats.categories.push(m.range), stats.data.push(m.count);
      });
    }
    return stats;
  },
  polygonAreaBins(state) {
    let stats = { categories: [], data: [] };
    if (state.statsData) {
      state.statsData.PolygonAreaBins.map(m => {
        stats.categories.push(m.range), stats.data.push(m.count);
      });
    }
    return stats;
  }
  */
}

const mutations = {
  SET_MARKETS: (state, payload) => (state.markets = payload)
};

const actions = {
  getMarkets({ commit }) {
    commit("SET_MARKETS", null);
    axios.get(`./data/markets.json`).then(response => {
        commit("SET_MARKETS", response.data);
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
