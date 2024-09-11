const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const cycaApi = require('./cyca-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/indicators', async (req, res) => {
    let data = await cycaApi.indicators()
    return res.status(200).json(data)
});

app.get('/news', async (req, res) => {
    let data = await cycaApi.news()
    return res.status(200).json(data)
});

exports.cyca = functions.https.onRequest(app);
