const functions = require("firebase-functions");

const express = require('express');
const cors = require('cors');
const app = express();

const yahooFinance = require("yahoo-finance2").default;


const VERSION = "jobinfo:0.0.0";
app.use(cors({ origin: true }));
app.get('/jobinfo', (request, response) => { response.send(VERSION) })

app.get('/quote',async (request, response) => {
    const { regularMarketPrice, currency } = await yahooFinance.quote('DRX.L');
    response.status(200).json({ price: regularMarketPrice, currency: currency });
})


exports.job = functions.https.onRequest(app);

exports.scheduledFunction = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    console.log('This will be run every 1 minutes!');
    return null;
});
