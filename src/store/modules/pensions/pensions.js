import { getDatabase, ref, child, get} from "firebase/database";
// import { genericGet } from "../common/c.js"
  
const state = {
  portfolios: null,
};

const getters = {
}
const setters = {
}

const mutations = {
  SET_PORTFOLIOS: (state, payload) => (state.portfolios = payload),
};

const actions = {
  async getPortfolios({ commit }) {
    commit("SET_PORTFOLIOS", null);
    get(child(ref(getDatabase()), `root/pensions/portfolios`))
      .then((snapshot) => {
        if (snapshot.exists()) { 
            commit("SET_PORTFOLIOS", snapshot.val())
        }
      })
      .catch((error) => { console.error(error); });
  },
}

export default {
  namespaced: true,
  state,
  getters,
  setters,
  mutations,
  actions
}
