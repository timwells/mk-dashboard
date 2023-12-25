const axios = require('axios');
const cheerio = require('cheerio');

const NT_SITE_URL = "https://www.nakedtrader.co.uk"
const NT_SITE_TRADES = NT_SITE_URL + "/trades.htm?type=sh"
const NT_SITE_ARCHIVES = NT_SITE_URL + "/archive.htm"

// ["Stock","Epic","Qty","Price","Target","Stop","Buy Date","Sell","Sell","Date","P/L"]
const scrapedata = (req, res) => {
    axios.get(NT_SITE_TRADES,{ headers: { Cookie: "nt=1;" } })
        .then((resp) => {
            const $ = cheerio.load(resp.data);
            const rows = [];
            const sel= '.trades tbody tr';
            const headers = [];
            $(sel).each((i, e) => {
                let rowObj = {};
                $(e).find("th").each((i, e) => { 
                    headers.push($(e).text().trim().toLowerCase().replace("/","").replace(" ","")) 
                });
                $(e).find("td").each((i, e) => { rowObj[headers[i]] = $(e).text().trim(); });

                if(Object.keys(rowObj).length > 0) {
                    rows.push(rowObj)
                }
            });          
            res.status(200).json(rows);
        });
}

const trades = (req, res) => {
    axios.get(NT_SITE_TRADES,{ headers: { Cookie: "nt=1;" } })
        .then((resp) => {
            const $ = cheerio.load(resp.data);
            const rows = [];
            const sel= '.trades tbody tr';
            const headers = [];
            $(sel).each((i, e) => {
                let rowObj = {};
                $(e).find("th").each((i, e) => { 
                    headers.push($(e).text().trim().toLowerCase().replace("/","").replace(" ","")) 
                });
                $(e).find("td").each((i, e) => { rowObj[headers[i]] = $(e).text().trim(); });

                if(Object.keys(rowObj).length > 0) {
                    rows.push(rowObj)
                }
            });          
            res.status(200).json(rows);
        });
}

const trades2 = (req, res) => {
    axios.get(NT_SITE_TRADES,{ headers: { Cookie: "nt=1;" } })
        .then((resp) => {
            const $ = cheerio.load(resp.data);
            const rows = [];
            const sel= '.trades tbody tr';
            const headers = [];            
            $(sel).each((i, e) => {
                let rowObj = {};
                $(e).find("th").each((i, e) => {
                    let colHeader = $(e).text().trim().toLowerCase().replace("/","").replace(" ","")
                    headers.push(colHeader)
                });
                let textId = [0,1,6,8]
                $(e).find("td").each((i, e) => { 
                    let item = $(e).text().trim();
                    if(textId.includes(i)) { rowObj[headers[i]] = item } 
                    else { rowObj[headers[i]] = (item.length > 0) ? parseFloat(item) : item; }
                });

                if(Object.keys(rowObj).length > 0) {
                    rowObj["tc"] = +((rowObj["qty"] * rowObj["price"]) / 100).toFixed(2)
                    rowObj["pd"] = +(rowObj["target"] - rowObj["price"]).toFixed(2)
                    rowObj["cp"] = +(100 * (rowObj["target"] - rowObj["price"]) / rowObj["price"]).toFixed(2)    
                    rows.push(rowObj)
                }
            });
            res.status(200).json(rows);
        });
}

const trades3 = (req, res) => {
    axios.get(NT_SITE_TRADES,{ headers: { Cookie: "nt=1;" } })
        .then((resp) => {
            const $ = cheerio.load(resp.data);
            const allTrades = [];
            const headers = [];
            const openTrades = [];
            let nAllTrades = 0; 
            let nGains = 0;
            let nLosses = 0;
            let nOpenTrades = 0
            let nClosedTrades = 0
            let openOrderCost = 0.0

            $('.trades tbody tr').each((i, e) => {
                let rowObj = {};
                $(e).find("th").each((i, e) => {
                    let colHeader = $(e).text().trim().toLowerCase().replace("/","").replace(" ","")
                    headers.push(colHeader)
                });
                let textId = [0,1,6,8]
                $(e).find("td").each((i, e) => { 
                    let item = $(e).text().trim();
                    if(textId.includes(i)) { rowObj[headers[i]] = item } 
                    else { rowObj[headers[i]] = (item.length > 0) ? parseFloat(item) : item; }
                });

                if(Object.keys(rowObj).length > 0) {
                    rowObj["tc"] = +((rowObj["qty"] * rowObj["price"]) / 100).toFixed(2)
                    rowObj["pd"] = +(rowObj["target"] - rowObj["price"]).toFixed(2)
                    rowObj["cp"] = +(100 * (rowObj["target"] - rowObj["price"]) / rowObj["price"]).toFixed(2)    

                    // Calculate the trading statistics
                    nAllTrades++;
                    let pl = rowObj["pl"]
                    if(typeof pl === "number") {
                        nClosedTrades++; (pl > 0) ? nGains++ : nLosses++;
                    } else { 
                        nOpenTrades++; 
                        openOrderCost += rowObj["tc"];
                        openTrades.push(rowObj);
                    }
                    allTrades.push(rowObj)
                }
            });
            let resObj = {
                trades: allTrades,
                openTrades: openTrades,
                statistics : {
                    allTrades: nAllTrades,
                    closedTrades: nClosedTrades,
                    openTrades: nOpenTrades,
                    openOrderCost : openOrderCost,
                    gains : nGains,
                    losses: nLosses,
                    gainPercent: +((nGains/nClosedTrades)*100).toFixed(2),
                    lossPercent: +((nLosses/nClosedTrades)*100).toFixed(2),
                }
            }

            res.status(200).json(resObj);
        });
}

const archivesdata = (req, res) => {
    let records = []
    axios.get(NT_SITE_ARCHIVES,{ headers: { Cookie: "nt=1;" } })
        .then((resp) => {
            const $ = cheerio.load(resp.data);
            const sel = '#center2 > h2';
            $(sel).each((i, e) => {                
                let archive = { year: e.children[0].data, archives:[] }
                for(let a = 0; a < e.next.children.length; a++) {
                    archive.archives.push(e.next.children[a].children[0].children[0].data)
                }
                records.push(archive)
            })
            res.status(200).json(records);
        });
}

const archives = (req, res) => {
    let records = []
    axios.get(NT_SITE_ARCHIVES,{ headers: { Cookie: "nt=1;" } })
        .then((resp) => {
            const $ = cheerio.load(resp.data);
            const sel = '#center2 > h2';
            $(sel).each((i, e) => {                
                let archive = { year: e.children[0].data, archives:[] }
                for(let a = 0; a < e.next.children.length; a++) {
                    archive.archives.push(e.next.children[a].children[0].children[0].data)
                }
                records.push(archive)
            })
            res.status(200).json(records);
        });
}

module.exports = {
    scrapedata,
    archivesdata,

    trades,
    trades2,
    trades3,
    archives,
}
