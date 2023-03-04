const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getDatabase } = require('firebase-admin/database');
const yF2 = require("yahoo-finance2").default;
const express = require('express');
const cors = require('cors');
const app = express();

const VERSION = "jobinfo:0.0.1";

app.use(cors({ origin: true }));
app.get('/jobinfo', (request, response) => { response.send(VERSION) })

app.get('/jobrun', async (request, response) => {
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
    } catch (e) { response.status(500) }
    return response.status(200)
})

exports.jobAdmin = functions.https.onRequest(app);

// https://crontab.guru/#0_8-17_*_*_1-5
// 0 8-16 * * 1-5
// TimeZone = Europe/London

exports.scheduledFunction = functions.pubsub
    .schedule('0 8-17 * * 1-5')
    .timeZone("Europe/London")
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
        } catch (e) { return }
        return
    });
