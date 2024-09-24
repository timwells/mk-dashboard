const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const ftApi = require('./ft-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/pm', async (req, res) => {
    let data = await ftApi.myMapFunds()
    return res.status(200).json(data)
});

exports.pm = functions.https.onRequest(app);
