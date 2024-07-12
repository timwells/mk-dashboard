import axios from "axios";
// import { getUserSecrets } from '@/firebase'
import store from "@/store";

// Constants
export const APP_FINTECH_API_KEY = process.env.VUE_APP_FINTECH_API_KEY;
export const APP_FINTECH_HEADERS = { 'x-api-key' : APP_FINTECH_API_KEY, 'Content-Type': 'application/json' }
export const APP_CLOUD_FUNCTION_URL = process.env.VUE_APP_FIREBASE_FUNCTION_URL;

// Functions
export async function genericGet(subPath,service,init,{commit}) {
  const host = store.getters['auth/appSecrets'].fintech_host
  const apikey = store.getters['auth/appSecrets'].fintech_apikey

  commit(service, init);
  let resp = await axios.get(`${host}${subPath}`,{ headers: { 'x-api-key': apikey} })
  commit(service, resp.data)
}

export async function genPOST(subPath,service,init, {payload}, {commit}) {
  const host = store.getters['auth/appSecrets'].fintech_host
  const apikey = store.getters['auth/appSecrets'].fintech_apikey

  commit(service, init);
  let resp = await axios.post(`${host}${subPath}`,
      payload, { headers: { 'x-api-key': apikey, 'Content-Type': 'application/json' }})
  commit(service, resp.data)
}
