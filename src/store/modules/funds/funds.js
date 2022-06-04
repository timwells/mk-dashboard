import axios from "axios";

const state = {
  funds: null
}

const getters = {
}

const mutations = {
    SET_FUNDS: (state, payload) => (state.funds = payload)
};

const actions = {
  getFunds({ commit }) {
    commit("SET_FUNDS", null);
    axios.get(`./data/funds.json`).then(response => {      
      commit("SET_FUNDS", response.data.map((f,i) => { f.key = i; return f}));
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
