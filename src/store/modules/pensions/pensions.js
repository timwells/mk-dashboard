import { getDatabase, ref, child, get} from "firebase/database";
  
const state = {
  portfolios: null,
  chartCache: [],
};

const getters = {
}
const setters = {
}

const mutations = {
  SET_PORTFOLIOS: (state, payload) => (state.portfolios = payload),
  RESET_CHART_CACHE: (state, payload) => (state.chartCache = payload),
  ADD_CHART_CACHE: (state, payload) => (state.chartCache = [...state.chartCache, payload]),

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

  async resetChartDataValues({ commit }) {
    commit("RESET_CHART_CACHE", [])
  },
  async getChartDataValues({ commit },{ metal }) {
    const resource = `${APP_CLOUD_FUNCTION_URL}/ft/historical/series?ticker=${symbol}`
    try {
      const {data} = await axios.get(resource, { headers: APP_FINTECH_HEADERS })
      commit("ADD_CHART_CACHE", data)
    } catch(e) {
        console.log("getChartDataValues",e)
    }
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
