import { getDatabase, ref, child, get} from "firebase/database";
import { genericGet } from "../common/c.js"
  
const state = {
  nextPrizeDrawDate: "?",
  holders: [],
  premiumBondsData: [],
  winners: [],
};

const getters = {
  getHoldersQry: state => {
    let hQry = ""
    for(let i=0; i<state.holders.length; i++) {
      if(hQry.length>0) hQry += ","
      hQry += `${state.holders[i].n}:${state.holders[i].h}`
    } return hQry
  },
  getHolderValue: (state) => (name) => {
      if(name.length>0) return (state.holders.find(h => h.n === name)).v;
      else return 0
  },
  getHolderWinRate: (state) => (name,winings) => {
    if(name.length>0) return (100*(winings/((state.holders.find(h => h.n === name)).v))).toFixed(1);
    else return 0
  },
  getMaxHoldersCount: (state) => () => {
    return state.winners.filter(item => item.holdings == 50000).length;
  },
  getWinnersCount: (state) => () => {
    return state.winners.length;
  },
  getMaxHolderWinnerRatio: (state) => () => {
    if(state.winners.length > 0) {
      return (100*((state.winners.filter(item => item.holdings == 50000).length) / state.winners.length)).toFixed(1) + "%"
    } return "0%"
  },
}
const setters = {
}

const mutations = {
  SET_HOLDERS: (state, payload) => (state.holders = payload),
  SET_PREMIUM_BONDS: (state, payload) => (state.premiumBondsData = payload),
  SET_NEXT_PRIZE_DRAW_DATE: (state, payload) => (state.nextPrizeDrawDate = payload.value),
  SET_WINNERS: (state, payload) => (state.winners = payload),
};

const actions = {
  async getHolders({ commit }) {
    commit("SET_HOLDERS", []);
    get(child(ref(getDatabase()), `root/pb/holders`))
      .then((snapshot) => {
        if (snapshot.exists()) { 
            commit("SET_HOLDERS", snapshot.val())
        }
      })
      .catch((error) => { console.error(error); });
  },
  async getPremiumBondsData({ commit }, { holders }) {
    await genericGet(`/pb/results?holders=${holders}`,"SET_PREMIUM_BONDS",[],{ commit })
  },
  async getNextPrizeDrawDate({ commit }) {
    await genericGet(`/pb/nextprizedraw`,"SET_NEXT_PRIZE_DRAW_DATE","?",{ commit })
  },
  async getWinners({ commit }) {
    await genericGet(`/pb/winners`,"SET_WINNERS",[],{ commit })
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
