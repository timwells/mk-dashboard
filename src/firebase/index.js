import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase, ref, child, get } from "firebase/database";
import axios from "axios";

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
let CloudFunctionInfo = ""

const getUserSecrets = async (user) => {  
  if(UserSecrets == null) { 
    const snapshot = await get(child(ref(getDatabase()), `root/secrets`))
    if (snapshot.exists()) UserSecrets = snapshot.val();
  } return UserSecrets
}

// https://us-central1-mk-d-b59f2.cloudfunctions.net/fintech/version
const getVersionInfo = async (user) => {  
  if(CloudFunctionInfo.length == 0) { 
    let response = await axios.get("https://us-central1-mk-d-b59f2.cloudfunctions.net/fintech/version")
    CloudFunctionInfo = response.data;
  } 
  return CloudFunctionInfo
}


const getCurrentUser = async () => { 
  // Firebase auth state change listener
  return await getAuth().onAuthStateChanged(async (user) => {
    if (user) {
      await getUserSecrets(user); 
      await getVersionInfo()      
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