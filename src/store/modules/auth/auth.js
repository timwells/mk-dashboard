// https://www.section.io/engineering-education/firebase-vue-authentication/
import { auth } from '@/firebase'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth'


const state = {
  user: null
};
const getters = {}
const mutations = {
  SET_USER: (state, payload) => (state.user = payload)
};

const actions = {
  async signIn({ commit }, { values }) {
    // console.log('-> auth.actions.signIn')
    commit('SET_USER', null)
    const res = await signInWithEmailAndPassword(auth,values.email,values.password)
      if (res) {
        commit('SET_USER', res.user)
      } else {
        throw new Error('sigin failed')
      }
  },
  async signOut({ commit }) {
    await signOut(auth)
    commit('SET_USER', null)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
