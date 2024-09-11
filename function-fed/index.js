const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const fedApi = require('./fed-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/observation', async (req, res) => {
    const { seriesId, frequency, units, scale} = req.query;
    let data = await fedApi.observation(seriesId, frequency, units, scale)
    return res.status(200).json(data)
});

exports.fed = functions.https.onRequest(app);
