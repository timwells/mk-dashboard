import {
    genericGet
  } from "../common/c.js"
  
  const state = {
    sentiment: null,
  };
  
  const getters = {
  }
  
  const mutations = {
    SET_SENTIMENT_DATA: (state, payload) => (state.sentiment = payload),
  };
  
  const actions = {
    async getSentiment({ commit }) {
      await genericGet(`/fintech/v1/scrape/cnn/marketsentiment`,"SET_SENTIMENT_DATA",null,{commit})
    },
    // https://us-central1-mk-d-b59f2.cloudfunctions.net/fintech/v1/scrape/cnn/marketsentiment
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  }
  