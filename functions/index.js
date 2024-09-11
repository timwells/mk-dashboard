const functions = require("firebase-functions");
//const app = require('./app');

const admin = require("firebase-admin");
const express = require('express');
const cors = require('cors');
const app = express();

const { config } = require("./config");

admin.initializeApp();

const VERSION = "1.0.95";
const API_KEY_NAME = "x-api-key"

const unauthorized = (res) => res.status(401).send('unauthorised');
const unprocessible = (res) => res.status(412).send('unprocessible');

const isApiKeyValid = (request,keyName,apiKeys) => {
    const apiKey = request.header(keyName);
    return (apiKey != undefined && apiKey != null && apiKey.length > 0) ? apiKeys.includes(apiKey) : false;
}

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(express.json());

app.get('/version', (request, response) => { response.send(VERSION) })

/*
app.get('/v1/quote', async (request, response) => {
    if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {
        response.status(200).send("Hello from Firebase /quote!");
    } else unauthorized(response)
})
*/

/*
app.get('/v1/scrape/:site', (request, response) => {
    try {
        if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {
            const { scrapedata, scrapedata1 } = require(`./wscrape/${request.params.site}.js`)
            if(request.query.q != null) { scrapedata1(request,response) } 
            else { scrapedata(request,response) }
        } else unauthorized(response)
    } catch(e) { unprocessible(response) }
})
*/
/*
app.get('/v1/scrape/:site/:service', (request, response) => {
    try {
        if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {
            let site = request.params.site;
            let service = request.params.service;
            let siteServices = require(`./wscrape/${site}.js`)
            
            siteServices[service](request,response)    
        } else unauthorized(response)
    } catch(e) { unprocessible(response) }
})
*/

/*
app.post('/v1/dcf/:model', (request, response) => {
    try {
        if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {
            let model = request.params.model;
            let modelServices = require(`./dcf/dcf.js`)
            modelServices[model](request,response)
        } else unauthorized(response)
    } catch(e) {
        unprocessible(response)
    }
})
*/

// Expose Express API as a single Cloud Function:
// exports.fintech = functions.https.onRequest(app);
const gOpts = {memory: '4GB', timeoutSeconds: 180};
exports.fintech = functions.runWith(gOpts).https.onRequest(app);

// exports.foolapi = functions.runWith(gOpts).https.onRequest(app);
//const { scheduledFunction, jobadmin } = require("./jobs/job")
// Expose Express API as a single Cloud Function:
//exports.jobadmin = jobadmin;
// Expose scheduled job
// exports.scheduledFunction = scheduledFunction;
