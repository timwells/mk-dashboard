const { onRequest } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require('firebase-functions/v2');

const express = require('express');
const app = express();
const cors = require('cors');
const hlApi = require('./hl-api.js');
const hlWeb = require('./hl-web.js');
const checkApiKey = require('./middleware/auth.js');

app.use(cors({ origin: true }));
app.use(express.json());
app.use(checkApiKey);

// Funds
app.get('/funds', async (req, res) => {
    const data = await hlApi.funds()
    return res.status(200).json(data)
});

app.get('/funds/stats', async (req, res) => {
    const data = await hlApi.fundsStats()
    return res.status(200).json(data)
});

app.get('/funds/page', async (req, res) => {
    const {start,rpp} = req.query;
    const data = await hlApi.fundsPage(start,rpp)
    return res.status(200).json(data)
});

app.get('/funds/pages/list-objs', async (req, res) => {
    const data = await hlApi.fundsPagesListObjs()
    return res.status(200).json(data)
});

app.get('/fund/details', async (req, res) => {
    const {companyid, sectorid, sedol } = req.query;
    const data = await hlApi.fundDetails(companyid,sectorid,sedol)
    return res.status(200).json(data)
});

app.get('/fund/analysis', async (req, res) => {
    const {sedol } = req.query;
    const data = await hlWeb.fundAnalysis(sedol)
    return res.status(200).json(data)
});

// ETFS
app.get('/etfs/stats', async (req, res) => {
    const data = await hlWeb.etfStats()
    return res.status(200).json(data)
});

app.get('/etfs/compaines/list', async (req, res) => {
    let data = await hlWeb.etfCompaniesList()
    return res.status(200).json(data)
});

app.get('/etfs/compaines/funds/list', async (req, res) => {
    const { companyid } =  req.query;
    const data = await hlWeb.etfCompaniesFundsList(companyid)
    return res.status(200).json(data)
});

app.get('/etfs', async (req, res) => {
    const data = await hlWeb.etfs()
    return res.status(200).json(data)
});

app.get('/etf/details', async (req, res) => {
    const { sedol } = req.query;
    const data = await hlWeb.etfDetails(sedol)
    return res.status(200).json(data)
});

setGlobalOptions({ timeoutSeconds: 120 });
exports.hl = onRequest(app);
