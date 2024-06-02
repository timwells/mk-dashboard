import {
    genericGet,
    genPOST
  } from "../common/c.js"
  
  const state = {
    dcf: null,
  };
  
  const getters = {
  }
  
  const mutations = {
    SET_DCF_RESULT: (state, payload) => (state.dcf = payload),
  };
  
  const actions = {
    async postDCF({ commit }, {dcf}) {
        // console.log(dcf)
        await genPOST(`/fintech/v1/dcf/model3`,"SET_DCF_RESULT",null,{payload: dcf}, {commit })
    },
  }
  
  export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  }
  