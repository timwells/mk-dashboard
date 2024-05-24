import axios from "axios";
import { getUserSecrets } from '@/firebase'

// Constants
export const APP_FINTECH_API_KEY = process.env.VUE_APP_FINTECH_API_KEY;
export const APP_FINTECH_HEADERS = { 'x-api-key' : APP_FINTECH_API_KEY }
export const APP_CLOUD_FUNCTION_URL = process.env.VUE_APP_FIREBASE_FUNCTION_URL;

// Functions
export async function genericGet(subPath,service,init,{commit}) {
    let secrets = await getUserSecrets();
    commit(service, init);
    let resp = await axios.get(`${secrets.fintech_host}${subPath}`,{ headers: { 'x-api-key' : secrets.fintech_apikey} })
    commit(service, resp.data)
  }
  