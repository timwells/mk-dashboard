const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const axios = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
const { config } = require("./config");

const VERSION = "0.0.7";
const API_KEY_NAME = "x-api-key"

const unauthorized = (res) => res.status(401).send('unauthorized');
const unprocessible = (res) => res.status(412).send('unprocessible');

const isApiKeyValid = (request,keyName,apiKeys) => {
    const apiKey = request.header(keyName);
    return (apiKey != undefined && apiKey != null && apiKey.length > 0) ? apiKeys.includes(apiKey) : false;
}

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get('/version', (request, response) => { response.send(VERSION) })

app.get('/v1/quote', async (request, response) => {
    if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {
        response.status(200).send("Hello from Firebase /quote!");
    } else unauthorized(response)
})

app.get('/v1/scrape/:site', (request, response) => {
    if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {
        const { scrapedata, scrapedata1 } = require(`./wscrape/${request.params.site}.js`)
        if(request.query.q != null) { scrapedata1(request,response) } 
        else { scrapedata(request,response) }
    } else unauthorized(response)
})

// Expose Express API as a single Cloud Function:
exports.fintech = functions.https.onRequest(app);

const { scheduledFunction, jobAdmin } = require("./jobs/job")

// Expose Express API as a single Cloud Function:
exports.jobAdmin = jobAdmin;
// Expose scheduled job
exports.scheduledFunction = scheduledFunction;
