const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const gbccApi = require('./gbcc-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/test', async (req, res) => {
    return res.status(200).json({ name:"gbcc" })
});

app.get('/categories', async (req, res) => {
    return res.status(200).json(await gbccApi.getCategories())
});

app.get('/products', async (req, res) => {
    const { id } = req.query
    return res.status(200).json(await gbccApi.getProducts(id))
});

exports.gbcc = functions.https.onRequest(app);
