const { onRequest } = require("firebase-functions/v2/https");
const express = require('express');
const cors = require('cors');
const app = express();
const checkApiKey = require('./middleware/auth.js');
const ddApi = require('./dd-api.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/exdividenddates', async (req, res) => {
    let data = await ddApi.exdividenddates()
    return res.status(200).json(data)
});

app.get('/dividend-history', async (req, res) => {
    const {divlink} = req.query;

    let data = await ddApi.dividenhistory(divlink)
    return res.status(200).json(data)
});

exports.dd = onRequest(app);
