import axios from "axios";
import {
    APP_CLOUD_FUNCTION_URL, 
    APP_FINTECH_HEADERS,
} from "../common/c.js"

const SAN_TYPES = {
  INCOME: 0,
  CASH_FLOW: 1,
  BALANCE_SHEET: 2,
  RATIOS: 3,
}
const FIX = 3
const state = {
    financials: null,

    incomeStatementData: null,    // 0
    cashFlowStatementData: null,  // 1
    balanceSheetData: null,       // 2
    ratiosData: null,             // 3

    sanTypes:SAN_TYPES
}

const INCOME_STATEMENT_DATA = "incomeStatementData"
const CASH_FLOW_STATEMENT_DATA = "cashFlowStatementData"
const BALANCE_SHEET_DATA = "balanceSheetData"
const RATIOS_DATA = "ratiosData"

const lookUpTitle = (arr,id) => (arr.find((e)=> e.id === id).title)
const fmt = (v) => (v != null ? v.toFixed(FIX): "-")

const getters = {
  sanTypes: (state) => () => state.sanTypes,

  financialTableColumns: (state) => () => {
    return [
      { dataIndex: "ledger", title: "Year" },
      ...state.incomeStatementData.data.financialData.datekey.map((e,i) => { return { dataIndex:"C"+i, title: e.split("-")[0] }}),
    ]
  },

  financialTableData: (state) => (type) => {    
    let dataSet = ""
    switch(type) {
      case SAN_TYPES.INCOME: dataSet = INCOME_STATEMENT_DATA; break
      case SAN_TYPES.CASH_FLOW: dataSet = CASH_FLOW_STATEMENT_DATA; break
      case SAN_TYPES.BALANCE_SHEET: dataSet = BALANCE_SHEET_DATA; break
      case SAN_TYPES.RATIOS: dataSet = RATIOS_DATA; break
    }

    return state[dataSet].data.rowIds.map((e,i) => { 
      let c0 = state[dataSet].data.financialData[e][0]
      let c1 = state[dataSet].data.financialData[e][1]
      let c2 = state[dataSet].data.financialData[e][2]
      let c3 = state[dataSet].data.financialData[e][3]
      let c4 = state[dataSet].data.financialData[e][4]
      let c5 = state[dataSet].data.financialData[e][5]
      let ledger = lookUpTitle(state[dataSet].data["map"],e)

      return { key: i,"ledger": ledger,"C0": fmt(c0),"C1": fmt(c1),"C2": fmt(c2),"C3": fmt(c3),"C4": fmt(c4),"C5": fmt(c5) }
    })
  },
  financialDCFData: (state) => () => { 
    return {
      nameFull: state.incomeStatementData.data.info.nameFull,
      shareswa: state.incomeStatementData.data.financialData["shareswa"][0],
      fcf: state.cashFlowStatementData.data.financialData["fcf"][0],
      debt: state.balanceSheetData.data.financialData["debt"][0]
    }
  }
}  

const mutations = {
  SET_FINANCIALS: (state, payload) => (state.financials = payload),
  SET_INCOME_STATEMENT_DATA: (state, payload) => (state.incomeStatementData = payload),
  SET_CASH_FLOW_STATEMENT_DATA: (state, payload) => (state.cashFlowStatementData = payload),
  SET_BALANCE_SHEET_DATA: (state, payload) => (state.balanceSheetData = payload),
  SET_RATIOS_DATA: (state, payload) => (state.ratiosData = payload),
};

const actions = {
  async getFinancials({ commit }, { exchange, symbol }) {
    axios.get(`${APP_CLOUD_FUNCTION_URL}/fintech/v1/scrape/san/financials?exchange=${exchange}&symbol=${symbol}`,{ headers: APP_FINTECH_HEADERS })
      .then(response => { 
        commit("SET_FINANCIALS", response.data) 
        commit("SET_INCOME_STATEMENT_DATA", response.data[0]) 
        commit("SET_CASH_FLOW_STATEMENT_DATA", response.data[1]) 
        commit("SET_BALANCE_SHEET_DATA", response.data[2]) 
        commit("SET_RATIOS_DATA", response.data[3]) 
      })
    },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
