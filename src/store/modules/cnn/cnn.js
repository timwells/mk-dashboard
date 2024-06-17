import {
  genericGet
} from "../common/c.js"
  
const state = {
  sentiment: null,
};
  
const getters = {
  //gFearAndGreedHistorical: (state) => () => state.sentiment.fear_and_greed_historical,
  //gFearAndGreedHistoricalData: (state) => 
  //  () => state.sentiment.fear_and_greed_historical.data.map((e) =>  e.y),
  //gFearAndGreedHistoricalDataLabel: (state) => 
  //  () => state.sentiment.fear_and_greed_historical.data.map((e) =>  (new Date(e.x )).toDateString()),
}
  
const mutations = {
  SET_SENTIMENT_DATA: (state, payload) => { 
    return (state.sentiment = payload) 
  },
};
  
const actions = {
  async getSentiment({ commit }) {
    await genericGet(`/fintech/v1/scrape/cnn/marketsentiment`,"SET_SENTIMENT_DATA",null,{commit})
  },
}
  
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
  