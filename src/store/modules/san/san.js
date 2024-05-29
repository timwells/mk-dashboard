import axios from "axios";
import {
    APP_CLOUD_FUNCTION_URL, 
    APP_FINTECH_HEADERS,
} from "../common/c.js"

const state = {
    financials: null,
};

/*
const balanceSheetData = [
  {
    entity:"Cash & Equivalents",
    y23: 23.51,
    y22: 22
  },
  {
    entity:"*Cash & Cash Equivalents*",
    y23: 23.51,
    y22: 22
  },
  {
    entity:"Cash Growth",
    y23: "41.95%",
    y22: 22
  },
  {
    entity:"Receivables",
    y23: 20.74,
    y22: 22
  },
  {
    entity:"Inventory",
    y23: 1.85,
    y22: 22
  },
  {
    entity:"Other Current Assets",
    y23: 1.7,
    y22: 22
  },

]

*/

//   gMtplDataSetExists: (state) => (dsName) => state.mtplDataSets.findIndex((d) => (d.ds === dsName)),
const getters = {
  incomeStatement() {

    
    // return financials: (state) => (dsName) => state.mtplDataSets.findIndex((d) => (d.ds === dsName)),
    // return gMtplDataSetExists: (state) => (dsName) => state.mtplDataSets.findIndex((d) => (d.ds === dsName)),
  }
}

const mutations = {
  SET_FINANCIALS: (state, payload) => (state.financials = payload),
};

const actions = {
  async getFinancials({ commit }, { exchange, symbol }) {
    console.log(`getFinancials: ${exchange}, ${symbol}`);
    axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/san/financials?exchange=${exchange}&symbol=${symbol}`,{ headers: APP_FINTECH_HEADERS })
      .then(response => { commit("SET_FINANCIALS", response.data) })
    },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
