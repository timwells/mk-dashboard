import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
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
let UserSecrets = null

const getCurrentUser = () => {
  console.log('-> getCurrentUser');
  return new Promise((resolve, reject) => {
      const unsubscribe = getAuth().onAuthStateChanged(user => {
          unsubscribe();
          console.log('getCurrentUser:',user)
          resolve(user);
      }, reject);
  })
};

const getUserSecrets = async (user) => {  
  if(UserSecrets == null) { 
    const snapshot = await get(child(ref(getDatabase()), `root/secrets`))
    if (snapshot.exists()) UserSecrets = snapshot.val();
  }
  return UserSecrets
}

const getCurrentUser1 = async () => { 
  // Firebase auth state change listener
  console.log('-> getCurrentUser1');
  return await getAuth().onAuthStateChanged(async (user) => {
    if (user) {
      await getUserSecrets(user)
      // console.log('getCurrentUser1:',user)
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
  getCurrentUser1,
  getUserSecrets,
  database
};