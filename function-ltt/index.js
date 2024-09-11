const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const lttApi = require('./ltt-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/thumbnails', async (req, res) => {
    let data = await lttApi.thumbnails()
    return res.status(200).json(data)
});

exports.ltt = functions.https.onRequest(app);
