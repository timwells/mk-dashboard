const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const ftApi = require('./ft-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/mymapfunds', async (req, res) => {
    let data = await ftApi.myMapFunds()
    return res.status(200).json(data)
});

app.get('/historical/series', async (req, res) => {
    const { ticker } = req.query
    let data = await ftApi.getSeries(ticker)
    return res.status(200).json(data)
});

app.get('/lookup/symbol', async (req, res) => {
    const { ticker } = req.query
    let data = await ftApi.lookUpSymbol(ticker)
    return res.status(200).json(data)
});


exports.ft = functions.https.onRequest(app);
