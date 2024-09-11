const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const ddApi = require('./dd-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/exdividenddate', async (req, res) => {
    console.log("exdividenddate")
    let data = await ddApi.exdividenddate()
    return res.status(200).json(data)
});

exports.dd = functions.https.onRequest(app);
