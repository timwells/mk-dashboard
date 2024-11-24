const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const mtclApi = require('./mtcl-api.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/mtcl', async (req, res) => {
    // const {ds} = req.query;
    let data = await mtclApi.monteCarloModelImpl()
    return res.status(200).json(data)
});

app.get('/mtcl2', async (req, res) => {
    const {
        initialPot,
        annualDrawdown,
        meanReturn,
        stdDev,
        years,
        startYear,
        iterations
    } = req.query;

    return res.status(200).json(
        await mtclApi.monteCarloModelImpl2(
            parseFloat(initialPot),
            parseFloat(annualDrawdown),
            parseFloat(meanReturn),
            parseFloat(stdDev),
            parseInt(years),
            parseInt(startYear),
            parseInt(iterations)
        ))
})

exports.mtcl = functions.https.onRequest(app);
