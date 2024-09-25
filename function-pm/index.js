const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const pmApi = require('./pm-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

const VERSION = 'pm-0.0.1';

app.get('/version', (req, res) => { res.send(VERSION) })

app.get('/prices', async (req, res) => {
    const data = await pmApi.prices()
    return res.status(200).json(data)
});

app.get('/gold', async (req, res) => {
    const data = await pmApi.gold()
    return res.status(200).json(data)
});


exports.pm = functions.https.onRequest(app);
