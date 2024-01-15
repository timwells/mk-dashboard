const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { getDatabase } = require('firebase-admin/database');
const yF2 = require("yahoo-finance2").default;
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const VERSION = "jobinfo:0.0.3";
const { config } = require("../config");

const STYLES =  `
<style>
.gmail-table {
  border: solid 2px #DDEEEE;
  border-collapse: collapse;
  border-spacing: 0;
  font: normal 14px Roboto, sans-serif;
}
.gmail-table thead th {
  background-color: #DDEFEF;
  border: solid 1px #DDEEEE;
  color: #336B6B;
  padding: 10px;
  text-align: left;
  text-shadow: 1px 1px 1px #fff;
}
.gmail-table tbody td {
  border: solid 1px #DDEEEE;
  color: #333;
  padding: 10px;
  text-shadow: 1px 1px 1px #fff;
}
</style>`

function _jsontocsv(arr,delim) {
    const array = [Object.keys(arr[0])].concat(arr)
    return array.map(e => Object.values(e).join(delim)).join('\n')
}

function jsonToTable(jsonArray) {
    var table = '<table class="gmail-table">';  
    table += '<thead><tr>';

    const array = [Object.keys(jsonArray[0])]
    for (var i = 0; i < array.length; i++) { table += '<th>' + array[i] + '</th>';}

    table += '</tr></thead>';  
    table += '<tbody>';
    for (var i = 0; i < jsonArray.length; i++) {
      table += '<tr>';
      for (var key in jsonArray[i]) {
        if (jsonArray[i].hasOwnProperty(key)) { table += '<td>' + jsonArray[i][key] + '</td>'; }
      }
      table += '</tr>';
    }
    table += '</tbody>';  
    table += '</table>';
    return table;
}
  
const TRANSPORTER = nodemailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    secure: true,
    service: config.emailCredentials.service,
    auth: { user: config.emailCredentials.email, pass: config.emailCredentials.pass },
});

async function scanStockWatch() {
    const db = getDatabase();
    const watchRef = db.ref('root/stocks/watch');
    const snapshot = await watchRef.once('value');
    const obj = snapshot.val();
    let stocks = [];
    const ts = new Date();

    await db.ref(`root/stocks/lastrun`).set(ts.toISOString())
    let debugTicker=""
    try {
        for(let i = 0; i < obj.length; i++) {
            const ts = new Date();
            debugTicker = obj[i].n;
            const { regularMarketPrice, currency } = await yF2.quote(obj[i].n);
            await db.ref(`root/stocks/watch/${i}/v`).set(regularMarketPrice)
            let bTrigger = false
            if(regularMarketPrice < obj[i].h) bTrigger = true

            stocks.push({ 
                ticker: obj[i].n, 
                price: regularMarketPrice,
                triggered: bTrigger, 
                ts: ts.toLocaleString()
            })

            await db.ref(`root/stocks/watch/${i}/tp`).set(bTrigger)
            await db.ref(`root/stocks/watch/${i}/ts`).set(ts.toISOString())
        }
        const tsn = new Date();
        if(tsn.getHours() == 16) {
            const mailOptions = {
                from: config.emailCredentials.email, 
                to: config.emailCredentials.to,
                subject: 'StockWatch End Of Day',
                html: jsonToTable(stocks)
            };

            await TRANSPORTER.sendMail(mailOptions, (error, info) => {
                if(error) functions.logger.log(error.toString())
                else functions.logger.log(info)
            });
        }        
    } catch (e) { 
        await db.ref(`root/stocks/log`).set(e.message + ":" + debugTicker)            
        return 
    }
}

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.get('/jobinfo', (request, response) => { response.send(VERSION) })

/*
app.get('/jobemail', async (request, response) => {
    const mailOptions = {
        from: config.emailCredentials.email, 
        to: config.emailCredentials.to,
        subject: 'StockWatch Updates',
        html: 'Email body'
    };
      
    return await TRANSPORTER.sendMail(mailOptions, (error, info) => {
        if(error) { return response.send(error.toString()); }
        return response.send('Sent');
    });
})    
*/

app.get('/jobrun', async (request, response) => {
    await scanStockWatch()
    return response.send('ok');
})

exports.jobadmin = functions.https.onRequest(app);

// https://crontab.guru/#0_8-17_*_*_1-5
// 0 8-16 * * 1-5
// TimeZone = Europe/London
exports.scheduledFunction = functions.pubsub
    .schedule('0 8-17 * * 1-5')
    .timeZone("Europe/London")
    .onRun(async (context) => {
        await scanStockWatch()
    });
