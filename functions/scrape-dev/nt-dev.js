const axios = require('axios');
const cheerio = require('cheerio');
const NT_SITE_URL = "https://www.nakedtrader.co.uk"
const NT_SITE_TRADES = NT_SITE_URL + "/trades.htm?type=sh"
const NT_SITE_ARCHIVES = NT_SITE_URL + "/archive.htm"

// ["Stock","Epic","Qty","Price","Target","Stop","Buy Date","Sell","Sell","Date","P/L"]
function scanTrades2() {
    console.log("scanTrades2")
    return axios.get(NT_SITE_TRADES,{ headers: { Cookie: "nt=1;" } })
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
/*
    0 Servelec
    1 SERV
    2 3300
    3 212.00
    4 290
    5 195
    6 03/12/2013
    7 228.60
    8 15/06/2016
    9 547.00
*/
                let textId = [0,1,6,8]
                $(e).find("td").each((i, e) => { 
                    let item = $(e).text().trim();
                    if(textId.includes(i)) { rowObj[headers[i]] = item } 
                    else { rowObj[headers[i]] = (item.length > 0) ? parseFloat(item) : item; }
                });

                rowObj["tc"] = (rowObj["qty"] * rowObj["price"]) / 100;
                rowObj["pd"] = (rowObj["target"] - rowObj["price"]);
                rowObj["cp"] = +(100 * (rowObj["target"] - rowObj["price"]) / rowObj["price"]).toFixed(2)

                if(Object.keys(rowObj).length > 0) {
                    rows.push(rowObj)
                }
                console.log(rowObj)
            });
            // console.log(rows)
            return rows
        });
}

function scanTrades() {
    console.log("scanTrades")
    return axios.get(NT_SITE_TRADES,{ headers: { Cookie: "nt=1;" } })
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
                $(e).find("td").each((i, e) => {
                    rowObj[headers[i]] = $(e).text().trim(); 
                });

                if(Object.keys(rowObj).length > 0) {
                    rows.push(rowObj)
                }
            });
            console.log(rows)
            return rows
        });
}

// https://cheerio.js.org/docs/basics/selecting
function scanArchives() {
    let records = []
    return axios.get(NT_SITE_ARCHIVES,{ headers: { Cookie: "nt=1;" } })
        .then(async (resp) => {
            const $ = await cheerio.load(resp.data);
            const sel = '#center2 > h2';
            $(sel).each((i, e) => {                
                let archive = { yearMonth: e.children[0].data, archives:[] }
                for(let a=0; a < e.next.children.length; a++) {
                    archive.archives.push(e.next.children[a].children[0].children[0].data)
                }
                // if(i>3) process.exit(1);
                records.push(archive)
            })
            return records
        });
}

module.exports = {
    scanTrades,
    scanTrades2,
    scanArchives
}

