import axios from "axios";

const state = {
  values : [],
  categories: []
};

/* { "value": "31", "value_classification": "Fear", "timestamp": "1660089600"} */
const getters = {
}

//   SET_NAKED_TRADES: (state, payload) => (state.nakedtrades = payload),
const mutations = {
  SET_DATA: (state, payload) => {
    state.values = payload.map((e) => parseInt(e.value)).reverse();
    state.categories = payload.map((e) => (new Date(parseInt(e.timestamp)*1000)).toLocaleDateString('en-GB')).reverse();
  }
};

const actions = {
  getIndex({ commit }) {
    axios.get('https://api.alternative.me/fng/?limit=100')
        .then(response => { commit("SET_DATA", response.data.data) })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
