import { initializeApp } from 'firebase/app'
import { getAuth,onAuthStateChanged } from 'firebase/auth'
import { getDatabase, ref, child, get } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIRBEASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL
};

const app = initializeApp(firebaseConfig);
const auth = getAuth()
const database = getDatabase(app)

export {
  auth,
  database,
};