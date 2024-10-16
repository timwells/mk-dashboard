const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const onsApi = require('./ons-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

//https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7bt/mm23/data

app.get('/historical/series', async (req, res) => {

    const { seriespath } = req.query
    let data = await onsApi.getSeries(seriespath)
    return res.status(200).json(data)
});

exports.ons = functions.https.onRequest(app);
