
const { onRequest } = require("firebase-functions/v2/https");
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

const express = require('express');
const app = express();
const cors = require('cors');
const checkApiKey = require('./middleware/auth.js');
const bgeApi = require('./bge-api.js');

app.use(cors({ origin: true }));
app.use(checkApiKey);
app.use(express.json());

app.get('/version', async (req, res) => {
    return res.status(200).json({"version": "1.0.1"})
});

app.get('/historical/values', async (req, res) => {
    const { path } = req.query
    let data = await bgeApi.getHistoricalValuesImpl(path)
    return res.status(200).json(data)
});

exports.bge = onRequest(app);

