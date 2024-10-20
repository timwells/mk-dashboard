const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const tflApi = require('./tfl-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/test', async (req, res) => {
    // let data = await tflApi.getSeries()
    return res.status(200).json({ name:"tfl" })
});

app.get('/catalogue', async (req, res) => {
    let data = await tflApi.getCatalogue()
    return res.status(200).json(data)
});

app.get('/historical/series', async (req, res) => {
    //const { ticker } = req.query
    let data = await tflApi.getSeries()
    return res.status(200).json(data)
});

app.get('/historical/series2', async (req, res) => {
    const { datasetname } = req.query
    let data = await tflApi.getSeries2(datasetname)
    return res.status(200).json(data)
});



exports.tfl = functions.https.onRequest(app);
