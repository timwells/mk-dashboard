const { onRequest } = require("firebase-functions/v2/https");
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

app.get('/exdividenddate2', async (req, res) => {
    console.log("exdividenddate2")
    let data = await ddApi.exdividenddate2()
    return res.status(200).json(data)
});
app.get('/exdividenddate3', async (req, res) => {
    let data = await ddApi.exdividenddate3()
    return res.status(200).json(data)
});

exports.dd = onRequest(app);
