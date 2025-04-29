const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require('firebase-functions/v2');

const express = require('express');
const app = express();
const cors = require('cors');
const lttApi = require('./ltt-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

const VERSION = 'llt-0.0.1';

app.get('/version', (req, res) => { res.send(VERSION) })

app.get('/historical/values', async (req, res) => {
    const { 
        datasetname,
    } = req.query

    let data = await lttApi.getHistoricalValuesImpl(datasetname)
    return res.status(200).json(data)
});

exports.ltt = onRequest(app);
