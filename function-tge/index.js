const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const tgeApi = require('./tge-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/commodities', async (req, res) => {
    let data = await tgeApi.commodities()
    return res.status(200).json(data)
});

exports.tge = functions.https.onRequest(app);
