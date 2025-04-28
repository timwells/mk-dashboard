const { onRequest } = require("firebase-functions/v2/https");
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

const express = require('express');
const app = express();
const cors = require('cors');
const checkApiKey = require('./middleware/auth.js');
const yahooApi = require('./yahoo-api.js');

app.use(cors({ origin: true }));
app.use(checkApiKey);
app.use(express.json());

app.get('/version', async (req, res) => {
    return res.status(200).json({"version": "1.0.2"})
});

app.get('/historical/values', async (req, res) => {
    const { 
        expression,
        period1,
        period2,
        interval
    } = req.query
    let data = await yahooApi.getHistoricalValuesImpl(expression,period1,period2,interval)
    return res.status(200).json(data)
});


exports.yahoo = onRequest(app);

