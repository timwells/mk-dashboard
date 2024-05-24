import axios from "axios";
import { genericGet } from "../common/c.js"
const FILTER_ACCUMULATION = "Accumulation"

const state = {
  funds: null,
  details: null,

  indexData: []
}

const getters = {
  gfundDetail: (state) => (sedol) => state.fundDetails.find((fd) => (fd.sedol === sedol)),
}

const mutations = {
    SET_FUNDS: (state, payload) => (state.funds = payload),
    SET_INDEX_MODELS: (state,payload) => (state.indexData = payload)
};

const actions = {
  getFunds({ commit }) {
    commit("SET_FUNDS", null);
    axios.get(`./data/allFunds.json`)
      .then(response => {
        commit("SET_FUNDS", 
            (response.data
              .filter(f => ((f.type === FILTER_ACCUMULATION) && (f.netAC > 0)))
                .map((f,i) => { f.key = i; return f}))
                  .sort((a,b) => a.netAC - b.netAC)                
        )
      })
  },
  async getIndexData({ commit }) {
    await genericGet(`/fintech/v1/scrape/hlindex/indexes`,"SET_INDEX_MODELS",[],{ commit })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
