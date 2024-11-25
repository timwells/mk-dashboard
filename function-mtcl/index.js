const functions = require('firebase-functions');
const express = require('express');
const app = express();
const cors = require('cors');
const mtclApi = require('./mtcl-api.js');
const mtclApi2 = require('./mtcl-api2.js');

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

app.get('/mtcl3', async (req, res) => {
    return res.status(200).json(await mtclApi2.monteCarloModelImpl())
})

app.get('/mtcl4', async (req, res) => {
    const {
        initialPortfolio,   
        annualWithdrawal,   
        inflationRate,     
        expectedReturn,     
        returnStdDev,       
        simulationYears, 
        startYear,          
        numSimulations        
    } = req.query;

    return res.status(200).json(await mtclApi2.monteCarloModelImpl2(
        parseFloat(initialPortfolio),   // £500,000 starting value
        parseFloat(annualWithdrawal),   // £30,000 initial withdrawal
        parseFloat(inflationRate),      // 2.5% annual inflation
        parseFloat(expectedReturn),     // 5% annual expected return
        parseFloat(returnStdDev),       // 10% return standard deviation
        parseInt(simulationYears),      // 2026
        parseInt(startYear),            // Simulate 30 years
        parseInt(numSimulations)        // Run x scenarios
    ))
})

exports.mtcl = functions.https.onRequest(app);
