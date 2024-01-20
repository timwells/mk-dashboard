import axios from "axios";
import { getDatabase, ref, child, get} from "firebase/database";

const state = {
  markets: null
};

const getters = {
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
  },
  getMarkets1({ commit }) {
    commit("SET_MARKETS", null);
    get(child(ref(getDatabase()), `root/fundinfo`))
      .then((snapshot) => {
        commit("SET_MARKETS", null);
        if (snapshot.exists()) { commit("SET_MARKETS", snapshot.val())}
      })
      .catch((error) => { console.error(error); });
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
