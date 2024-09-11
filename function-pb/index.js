const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const pbApi = require('./pb-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/results', async (req, res) => {
    const {holders} = req.query;
    let results = await pbApi.prizeResults(holders)
    return res.status(200).json(results)
});

app.get('/nextprizedraw', async (req, res) => {
    let nextPrizeDraw = await pbApi.nextPrizeDraw()
    return res.status(200).json({nextPrizeDraw: nextPrizeDraw})
});

exports.pb = functions.https.onRequest(app);
