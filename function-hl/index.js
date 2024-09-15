const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const hlApi = require('./hl-api.js');
const hlWeb = require('./hl-web.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

app.get('/funds/stats', async (req, res) => {
    let data = await hlApi.fundsStats()
    return res.status(200).json(data)
});

app.get('/fundsstats', async (req, res) => {
    let data = await hlApi.fundsStats()
    return res.status(200).json(data)
});

app.get('/funds/page', async (req, res) => {
    const {start,rpp} = req.query;
    let data = await hlApi.fundsPage(start,rpp)
    return res.status(200).json(data)
});

app.get('/fundspage', async (req, res) => {
    const {start,rpp} = req.query;
    let data = await hlApi.fundsPage(start,rpp)
    return res.status(200).json(data)
});

app.get('/funds', async (req, res) => {
    const data = await hlApi.funds()
    return res.status(200).json(data)
});

app.get('/funds/list-objs', async (req, res) => {
    let data = await hlApi.listFundObjs()
    return res.status(200).json(data)
});
app.get('/listfundsobjs', async (req, res) => {
    let data = await hlApi.listFundObjs()
    return res.status(200).json(data)
});

app.get('/fund/details', async (req, res) => {
    const { searchTitle } = req.query;
    let data = await hlApi.fundDetail(searchTitle)
    return res.status(200).json(data)
});

app.get('/funddetails', async (req, res) => {
    const {companyid, sectorid, sedol } = req.query;
    let data = await hlApi.fundDetails(companyid,sectorid,sedol)
    return res.status(200).json(data)
});

app.get('/fund/analysis', async (req, res) => {
    const {sedol } = req.query;
    let data = await hlWeb.fundAnalysis(sedol)
    return res.status(200).json(data)
});

const gOpts = {timeoutSeconds: 120};
exports.hl = functions.runWith(gOpts).https.onRequest(app);
