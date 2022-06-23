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

const getters = {
}

const mutations = {
  SET_USER: (state, payload) => (state.user = payload)
};

const actions = {
    async login({ commit }, {values}) {
      commit('SET_USER', null)
      const response = await signInWithEmailAndPassword(auth,values.email,values.password)
        if (response) {
            commit('SET_USER', response.user)
        } else {
            throw new Error('sigin failed')
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
