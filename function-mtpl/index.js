const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const mtplApi = require('./mtpl-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/dataset', async (req, res) => {
    const {ds} = req.query;
    let data = await mtplApi.dataset(ds)
    return res.status(200).json(data)
});

exports.mtpl = functions.https.onRequest(app);
