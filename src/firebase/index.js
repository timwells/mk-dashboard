import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

//initialize the firebase app
initializeApp(firebaseConfig)

const auth = getAuth()
console.log(auth)

export default {
    auth
};