const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const hlApi = require('./hl-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/fundscount', async (req, res) => {
    let data = await hlApi.fundsCount()
    return res.status(200).json(data)
});

app.get('/fundspage', async (req, res) => {
    const {start,rpp} = req.query;
    let data = await hlApi.fundsPage(start,rpp)
    return res.status(200).json(data)
});


exports.hl = functions.https.onRequest(app);
