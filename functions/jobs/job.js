const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getDatabase } = require('firebase-admin/database');

// admin.initializeApp(functions.config().firebase);

/*
app.post('/v1/event', (request, response) => {
    if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {
       const epoch = epochId2();
       const db = getDatabase();      
       const updates = {};
       updates[`events/${epoch.date}/${epoch.hr}/counts`] = admin.database.ServerValue.increment(1);
       updates[`events/${epoch.date}/total`] = admin.database.ServerValue.increment(1);
       db.ref().update(updates);
 
       return response.status(200).json('ok');
 
    } else return unauthorized(response)
 })
*/

const yF2 = require("yahoo-finance2").default;
const express = require('express');
const cors = require('cors');
const app = express();

const VERSION = "jobinfo:0.0.0";

app.use(cors({ origin: true }));
app.get('/jobinfo', (request, response) => { response.send(VERSION) })

app.get('/quote',async (request, response) => {
    const { regularMarketPrice, currency } = await yF2.quote('DRX.L');
    response.status(200).json({ price: regularMarketPrice, currency: currency });
})

app.get('/rdb5', async (request, response) => {
    const db = getDatabase();
    const watchRef = db.ref('stocks/watch');
    const snapshot = await watchRef.once('value');
    const obj = snapshot.val();
    let stocks = [];

    try {
        for(let i = 0; i < obj.length; i++) {
            const ts = new Date();
            const { regularMarketPrice, currency } = await yF2.quote(obj[i].n);
            stocks.push({ ticker: obj[i].n, price: regularMarketPrice, currency: currency,ts: ts.toISOString() })
            await db.ref(`stocks/watch/${i}/v`).set(regularMarketPrice)
            let bTrigger = false
            if(regularMarketPrice < obj[i].h) bTrigger = true
            await db.ref(`stocks/watch/${i}/tp`).set(bTrigger)
            await db.ref(`stocks/watch/${i}/ts`).set(ts.toISOString())
        }
    } catch (e) {
        return response.status(500).json([])    
    }
    return response.status(200).json(stocks)    
})

// https://crontab.guru/#0_8-16_*_*_1-5
// 0 8-16 * * 1-5
exports.job = functions.https.onRequest(app);

exports.scheduledFunction = functions.pubsub.schedule('0 8-16 * * 1-5')
    .onRun(async (context) => {
        const db = getDatabase();
        const watchRef = db.ref('stocks/watch');
        const snapshot = await watchRef.once('value');
        const obj = snapshot.val();
        let stocks = [];
    
        try {
            for(let i = 0; i < obj.length; i++) {
                const ts = new Date();
                const { regularMarketPrice, currency } = await yF2.quote(obj[i].n);
                stocks.push({ ticker: obj[i].n, price: regularMarketPrice, currency: currency,ts: ts.toISOString() })
                await db.ref(`stocks/watch/${i}/v`).set(regularMarketPrice)
                let bTrigger = false
                if(regularMarketPrice < obj[i].h) bTrigger = true
                await db.ref(`stocks/watch/${i}/tp`).set(bTrigger)
                await db.ref(`stocks/watch/${i}/ts`).set(ts.toISOString())
            }
        } catch (e) {
            return // response.status(500).json([])    
        }
        return // response.status(200).json(stocks)    
    });
