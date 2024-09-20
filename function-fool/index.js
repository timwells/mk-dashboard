const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const foolApi = require('./fool-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/historical', async (req, res) => {
    const { exchange, symbol, precision, period } = req.query
    let data = await foolApi.getDataImpl(exchange,symbol,precision,period)
    return res.status(200).json(data)
});

app.get('/historical2', async (req, res) => {
    const { exchange, symbol, precision, period } = req.query
    let data = await foolApi.getDataImpl2(exchange,symbol,precision,period)
    return res.status(200).json(data)
});
exports.fool = functions.https.onRequest(app);
