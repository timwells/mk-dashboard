const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const rvltApi = require('./rvlt-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/test', async (req, res) => {
    let data = await rvltApi.getSeries()
    return res.status(200).json({name:"rvlt"})
});
app.get('/historical/series', async (req, res) => {
    // const { ticker } = req.query
    let data = await rvltApi.getSeries()
    return res.status(200).json(data)
});

exports.tge = functions.https.onRequest(app);
