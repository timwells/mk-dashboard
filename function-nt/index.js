const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const ntApi = require('./nt-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/trades', async (req, res) => {
    let data = await ntApi.trades()
    return res.status(200).json(data)
});

app.get('/archives', async (req, res) => {
    let data = await ntApi.archives()
    return res.status(200).json(data)
});

app.get('/archivecontent', async (req, res) => {
    const {a} = req.query
    let html = await ntApi.archiveContent(a)
    return res.status(200).send(html)
});

exports.nt = functions.https.onRequest(app);
