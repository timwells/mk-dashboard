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

/*
  "columns": [
    {
      "dataIndex": "year",
      "title": "Year"
    },
    {
      "dataIndex": "",
      "title": "TTM"
    },
    {
      "dataIndex": "",
      "title": "2023"
    },
    {
      "dataIndex": "",
      "title": "2022"
    },
    {
      "dataIndex": "",
      "title": "2021"
    },
    {
      "dataIndex": "",
      "title": "2020"
    },
    {
      "dataIndex": "",
      "title": "2019"
    }
  ]
*/

/*
  {
    "name": "iShares Continental Euro Equity Index (H)",
    "href": "https://www.hl.co.uk/funds/fund-discounts,-prices--and--factsheets/search-results/i/ishares-continental-euro-equity-index-h-accumulation",
    "type": "Accumulation",
    "sedol": "BJL5BS1",
    "citicode": "K5WI",
    "netIC": 0,
    "netAC": 0.05,
    "fund": "funds/fund-discounts,-prices--and--factsheets/search-results/i/ishares-continental-euro-equity-index-h-accumulation",
    "key": 1165
  },
*/
//   gMtplDataSetExists: (state) => (dsName) => state.mtplDataSets.findIndex((d) => (d.ds === dsName)),
// ...state.financials[0].data.financialData.datekey.map((e) => { return {id: e.split("-")[0], title: e.e.split("-")[0] }}),
          const getters = {
    incomeStatement: (state) => () => state.financials[0].data,
    incomeStatementTable: (state) => () => {
      let _columns = [
        { dataIndex: "year", title: "Year" },
          ...state.financials[0].data.financialData.datekey.map((e) => 
            { 
              let entity = e.split("-")[0];
             return {dataIndex:'', title: entity, }
            }),
      ]

      //let __data = state.financials[0].data["map"].map((e) => { return { year: e.title } })
      //console.log(__data)
    

      // Find
      //  "id": "revenue" => Revenue
      //  "id": "revenueGrowth", => Revenue Growth (YoY),
      //  "id": "cor", => Cost of Revenue",
      //  "id": "gp", => "Gross Profit",
      //  "id": "sgna", =>  "Selling, General & Admin",
      //  "id": "opex" => "Operating Expenses"
      //
      //
      //
      //

      let __data = [
        {
          "year": state.financials[0].data["map"].find(({id})=> id === "revenue").title
        },
        {
          "year": state.financials[0].data["map"].find(({id})=> id === "revenueGrowth").title
        },        
        {
          "year": state.financials[0].data["map"].find(({id})=> id === "cor").title
        },       
        {
          "year": state.financials[0].data["map"].find(({id})=> id === "sgna").title
        },       
        {
          "year": state.financials[0].data["map"].find(({id})=> id === "opex").title
        },       
        {
          "year": state.financials[0].data["map"].find(({id})=> id === "opinc").title
        },       
        {
          "year": state.financials[0].data["map"].find(({id})=> id === "interestIncome").title
        },       
        {
          "year": state.financials[0].data["map"].find(({id})=> id === "interestExpense").title
        },       
        {
          "year": state.financials[0].data["map"].find(({id})=> id === "otherincome").title
        },       
        {
          "year": state.financials[0].data["map"].find(({id})=> id === "pretax").title
        },       
      ]

      let _data = [
        {
          "year" : "Revenue"
        },
        {
          "year" : "Revenue Growth (YoY)"
        },
        {
          "year" : "Cost of Revenue"
        },
        {
          "year" : "Gross Profit"
        }
      ]

      // Row0



      return {
        columns: _columns,
        data: __data
      }
    }
}  

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
*/

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
