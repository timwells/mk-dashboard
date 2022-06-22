// https://www.section.io/engineering-education/firebase-vue-authentication/

import firebaseConfig from "@/firebase"
import {
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth'

const state = {
  auth: null
};

const getters = {
}

const mutations = {
  SET_AUTH: (state, payload) => (state.auth = payload)
};

console.log(firebaseConfig)
const actions = {
    login({ commit }) {
        console.log("login")
        console.log(signInWithEmailAndPassword)
        signInWithEmailAndPassword(firebaseConfig,
            .then((response) => {
                if (response) {
                    console.log(response)
                    commit('SET_AUTH', response.user)
                } else {
                    throw new Error('sigin failed')
                }
            })
    }
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
