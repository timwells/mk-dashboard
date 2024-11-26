import axios from "axios";
import {
    APP_FINTECH_API_KEY,
    APP_FINTECH_HEADERS,
    APP_CLOUD_FUNCTION_URL,
} from "../common/c.js"


const state = {
    results: null,
    results2: null
};

const getters = {
  getSimulationsSummary: (state) => () => state.results2.simulations.filter((run) => run.depleted)
}

const mutations = {
  // RESET_CHART_CACHE: (state, payload) => (state.chartCache = payload),
  // ADD_CHART_CACHE: (state, payload) => (state.chartCache = [...state.chartCache, payload]),

    SET_RESULTS: (state, payload) => (state.results = payload),
    SET_RESULTS2: (state, payload) => (state.results2 = payload),
};

const actions = {
  async runSimulation({ commit }, { simulationValues }) {
    commit("SET_RESULTS", null)
    const qset = [
        `initialPot=${simulationValues.initialPot}`,
        `annualDrawdown=${simulationValues.annualDrawdown}`,
        `meanReturn=${simulationValues.meanReturn}`,
        `stdDev=${simulationValues.stdDev}`,
        `years=${simulationValues.years}`,
        `startYear=${simulationValues.startYear}`,
        `iterations=${simulationValues.iterations}`
    ]
    const resource = `${APP_CLOUD_FUNCTION_URL}/mtcl/mtcl2?${qset.join("&")}`
    try {
        const { data } = await axios.get(resource,{ headers: APP_FINTECH_HEADERS })
        commit("SET_RESULTS", data)
    } catch (e) {
        console.log(e)
    }
  },

  async runSimulation2({ commit }, { simulationValues }) {
    commit("SET_RESULTS2", null)
    const qset = [
        `initialPortfolio=${simulationValues.initialPortfolio}`,
        `annualWithdrawal=${simulationValues.annualWithdrawal}`,
        `inflationRate=${simulationValues.inflationRate}`,
        `expectedReturn=${simulationValues.expectedReturn}`,
        `returnStdDev=${simulationValues.returnStdDev}`,
        `simulationYears=${simulationValues.simulationYears}`,
        `startYear=${simulationValues.startYear}`,
        `numSimulations=${simulationValues.numSimulations}`
    ]
    const resource = `${APP_CLOUD_FUNCTION_URL}/mtcl/mtcl4?${qset.join("&")}`
    try {
        const { data } = await axios.get(resource,{ headers: APP_FINTECH_HEADERS })
        commit("SET_RESULTS2", data)
    } catch (e) {
        console.log(e)
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
