import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase, ref, child, get } from "firebase/database";
import store from "@/store";

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
let UserSecrets = null

const getUserSecrets = async (user) => {  

  console.log("getUserSecrets")

  if(UserSecrets == null) { 
    const snapshot = await get(child(ref(getDatabase()), `root/secrets`))
    if (snapshot.exists()) UserSecrets = snapshot.val();
    store.dispatch("app/getSecrets")
  } return UserSecrets
}

const getCurrentUser = async () => { 
  // Firebase auth state change listener
  return await getAuth().onAuthStateChanged(async (user) => {
    if (user) {
      await getUserSecrets(user);
      return user
    } else {
      // User is signed out
      return null
    }
  });
}

export {
  auth,
  getCurrentUser,
  getUserSecrets,
  database
};