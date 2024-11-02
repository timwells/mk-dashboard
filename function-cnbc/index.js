const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const checkApiKey = require('./middleware/auth.js');
const cnbcApi = require('./cnbc-api.js');

app.use(cors({ origin: true }));
app.use(checkApiKey);
app.use(express.json());

app.get('/historical/values', async (req, res) => {
    const { symbol } = req.query
    let data = await cnbcApi.getHistoricalValuesImpl(symbol)
    return res.status(200).json(data)
});

exports.cnbc = functions.https.onRequest(app);
