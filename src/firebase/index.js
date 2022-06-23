import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIRBEASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};

//initialize the firebase app
initializeApp(firebaseConfig)

const auth = getAuth()

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
      const unsubscribe =  getAuth().onAuthStateChanged(user => {
          unsubscribe();
          resolve(user);
      }, reject);
  })
};


export {
  auth,
  getCurrentUser
};