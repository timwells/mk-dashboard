const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const axios = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
const { performance } = require('perf_hooks');
const yF2 = require("yahoo-finance2").default;
const { config } = require("./config");
const { strictEqual } = require("assert");

const VERSION = "0.0.6";
const API_KEY_NAME = "x-api-key"

const unauthorized = (res) => res.status(401).send('unauthorized');
const isApiKeyValid = (request,keyName,apiKeys) => {
    const apiKey = request.header(keyName);
    return (apiKey != undefined && apiKey != null && apiKey.length > 0) ? apiKeys.includes(apiKey) : false;
}

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get('/version', (request, response) => {
    response.send(VERSION);
})

app.get('/v1/quote', async (request, response) => {
    if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {
        response.status(200).send("Hello from Firebase /quote!");
    } else {
        response.status(401).send('unauthorized');
    }
})

app.get('/v1/scrape/:site', (request, response) => {
    if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {
        const { scrapedata } = require(`./wscrape/${request.params.site}.js`)
        scrapedata(request,response);
    } else unauthorized(response)
})

// Expose Express API as a single Cloud Function:
exports.fintech = functions.https.onRequest(app);