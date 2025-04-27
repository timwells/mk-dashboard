const { onRequest } = require("firebase-functions/v2/https");
const express = require('express');
const app = express();
const cors = require('cors');
const checkApiKey = require('./middleware/auth.js');
const cnnApi = require('./cnn-api.js');

const VERSION = 'cnn-0.0.3';
app.use(cors({ origin: true }));
app.use(checkApiKey);
app.use(express.json());

app.get('/version', async (req, res) => res.send(VERSION) )

app.get('/marketsentiment', async (req, res) => {
    let data = await cnnApi.marketSentiment()
    return res.status(200).json(data)
});

exports.cnn = onRequest(app);



