/*
const functions = require("firebase-functions");
const yF2 = require("yahoo-finance2");

exports.helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
});

exports.q1 = functions.https.onRequest((request, response) => {
    yF2.search('AAPL').then(r => {
        response.send(r);
    });
});
*/

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const axios = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
const { performance } = require('perf_hooks');
const yF2 = require("yahoo-finance2").default;


const VERSION = "0.0.5";

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get('/version', (request, response) => {  
    response.send(VERSION);
})

app.get('/quote', (request, response) => {  
    response.send("Hello from Firebase /quote!");
})

app.get('/quote1', async (request, response) => {  
    result = await yF2.quote('BMGAX');    
    response.status(200).send(JSON.stringify(result));
})

app.get('/quote2', async (request, response) => {
    const item = request.query.item;
    result = await yF2.quote(item);

    response.contentType("application/json"); 
    response.status(200).send(JSON.stringify(result));
})

// Expose Express API as a single Cloud Function:
exports.fintech = functions.https.onRequest(app);
