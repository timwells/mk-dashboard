const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const pmApi = require('./pm-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/gold', async (req, res) => {
    let data = await pmApi.gold()
    return res.status(200).json(data)
});

exports.pm = functions.https.onRequest(app);
