import { getDatabase, ref, child, get} from "firebase/database";

const state = {
  markets: []
};

const getters = {
  getGroup: (state) => (group) => state.markets.filter((e) => (e.group === group)),
}

const mutations = {
  SET_MARKETS: (state, payload) => (state.markets = payload)
};

const actions = {
  getMarkets({ commit }) {
    commit("SET_MARKETS", null);
    get(child(ref(getDatabase()), `root/fundinfo`))
      .then((snapshot) => {
        commit("SET_MARKETS", null);
        if (snapshot.exists()) { console.log(snapshot.val()); commit("SET_MARKETS", snapshot.val());}
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
