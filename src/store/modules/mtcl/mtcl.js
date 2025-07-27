import axios from "axios";
import {
    APP_FINTECH_API_KEY,
    APP_FINTECH_HEADERS,
    APP_CLOUD_FUNCTION_URL,
} from "../common/c.js"


const state = {
    results2: null,
    sdp:null
  };

const getters = {
  getSimulationsSummary: (state) => () => state.results2.simulations.filter((run) => run.depleted)
}

const mutations = {
    SET_RESULTS2: (state, payload) => (state.results2 = payload),
    SET_SDP: (state, payload) => (state.sdp = payload)
};

const actions = {
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
  
  async runSdpModel({ commit }) {
    commit("SET_SDP", null)
    /*
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
    */

    const resource = `${APP_CLOUD_FUNCTION_URL}/mtcl/sdp`

    console.log(resource);

    try {
        const { data } = await axios.get(resource,{ headers: APP_FINTECH_HEADERS })
        commit("SET_SDP", data)
        console.log(data)
    } catch (e) {
        console.log(e)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
