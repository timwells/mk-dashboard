const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getDatabase } = require('firebase-admin/database');
const yF2 = require("yahoo-finance2").default;
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const VERSION = "jobinfo:0.0.2";
const { config } = require("../config");


function _ToCSV(arr,delim) {
    const array = [Object.keys(arr[0])].concat(arr)
    return array.map(e => Object.values(e).join(delim)).join('\n')
  }
  

app.use(cors({ origin: true }));

const TRANSPORTER = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    secure: true,
    service: config.emailCredentials.service,
    auth: { user: config.emailCredentials.email, pass: config.emailCredentials.pass },
});

app.get('/jobinfo', (request, response) => { response.send(VERSION) })

app.get('/jobemail', async (request, response) => {
    /*
    let transporter = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        secure: true,
        service: config.emailCredentials.service,
        auth: { user: config.emailCredentials.email, pass: config.emailCredentials.pass },
    });
    */
    const mailOptions = {
        from: config.emailCredentials.email, 
        to: config.emailCredentials.to,
        subject: 'StockWatch Updates',
        text: 'Email body'
    };
      
    return await TRANSPORTER.sendMail(mailOptions, (error, info) => {
        if(error) { return response.send(error.toString()); }
        return response.send('Sent');
    });
})    

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

        const mailOptions = {
            from: config.emailCredentials.email, 
            to: config.emailCredentials.to,
            subject: 'StockWatch End Of Day',
            text: _ToCSV(stocks,",")
        };

        await TRANSPORTER.sendMail(mailOptions);

    } catch (e) { response.status(500) }
    
    return response.status(200)
})

exports.jobadmin = functions.https.onRequest(app);

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
