const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const drmApi = require('./drm-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/portfolio', async (req, res) => {
    let data = await drmApi.portfolio()
    return res.status(200).json(data)
});

app.get('/holdings', async (req, res) => {
    const {investor} = req.query;
    let data = await drmApi.holdings(investor)
    return res.status(200).json(data)
});

exports.drm = functions.https.onRequest(app);
