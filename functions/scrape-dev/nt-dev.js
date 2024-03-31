const axios = require('axios');
const moment = require('moment');
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
            const allTrades = [];
            const headers = [];
            const openTrades = [];
            const closedTrades = [];
            let nAllTrades = 0; 
            let nGains = 0;
            let nLosses = 0;
            let nOpenTrades = 0
            let nClosedTrades = 0
            let openOrderCost = 0.0

            // Extract columns once from table
            $('.trades>tbody>tr>th').each((i, e) => {
                headers.push($(e).text().trim().toLowerCase().replace("/","").replace(" ",""))
            });
            
            // 0 Servelec,1 SERV,2 3300,3 212.00,4 290,5 195,
            // 6 03/12/2013,7 228.60,8 15/06/2016,9 547.00
            $(".trades>tbody>tr").each((i, e) => {
                let rowObj = {};
                let textId = [0,1,6,8]

                $(e).find("td").each((i, e) => {                
                    let item = $(e).text().trim();
                    if(textId.includes(i)) { rowObj[headers[i]] = item } 
                    else { rowObj[headers[i]] = (item.length > 0) ? parseFloat(item) : item; }
                });

                // Valdiate Order
                if(Object.keys(rowObj).length > 0) {
                    if(rowObj["stock"].length > 0 && rowObj["epic"].length > 0 && rowObj["buydate"].length > 0 && rowObj["price"] > 0) {

                        // Validate Buy Date
                        let splitDate = rowObj["buydate"].split("/");
                        let newBuyDate = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}` 
                                                
                        let baseDate = Date.parse("2010-01-01");
                        let buyDate = Date.parse(newBuyDate);

                        if(buyDate > baseDate) {
                            rowObj["tc"] = +((rowObj["qty"] * rowObj["price"]) / 100).toFixed(2)
                            rowObj["pd"] = +(rowObj["target"] - rowObj["price"]).toFixed(2)
                            rowObj["cp"] = +(100 * (rowObj["target"] - rowObj["price"]) / rowObj["price"]).toFixed(2)    

                            // Calculate the trading statistics
                            nAllTrades++;
                            let pl = rowObj["pl"]
                            let bd = moment(rowObj["buydate"],"DD/MM/YYYY")
                            let sd = moment(rowObj["selldate"],"DD/MM/YYYY")

                            if(rowObj["selldate"].length > 0) {
                                // console.log("Sell days Open:",rowObj["epic"],sd.diff(bd, 'days'))
                                rowObj["dopn"] = sd.diff(bd, 'days')
                                nClosedTrades++                                
                                
                                if(typeof pl === "number") {(pl > 0) ? nGains++ : nLosses++}                                
                                
                                
                                closedTrades.push(rowObj)
                            } else {
                                nOpenTrades++;
                                openOrderCost += rowObj["tc"]
                                let daysOpen = moment().diff(bd,"days")
                                rowObj["buydate"] = `${rowObj["buydate"]}`
                                rowObj["dopn"] = daysOpen
                                openTrades.push(rowObj) 
                            } 
                            allTrades.push(rowObj)
                        }
                    } else {
                        console.log("SKIP:",rowObj["epic"],"Buydate < baseDate")
                    }
                }
            });

            /*
            console.log(`Gains: ${+((nGains/nClosedTrades)*100).toFixed(2)}% (${nGains})`)
            console.log(`Losses: ${+((nLosses/nClosedTrades)*100).toFixed(2)}% (${nLosses})`)
            console.log(`OpenTrades: ${nOpenTrades}, ClosedTrades: ${nClosedTrades} AllTrades: ${nAllTrades}`)
            console.log(`OpenOrderCost: ${openOrderCost}`)
            console.log(`OpenTrades: ${openTrades}`)

            */
            let resObj = {
                allTrades: allTrades,
                openTrades: openTrades,
                closedTrades: closedTrades,
                statistics : {
                    allTrades: nAllTrades,
                    closedTrades: nClosedTrades,
                    openTrades: nOpenTrades,
                    openOrderCost : parseFloat(openOrderCost.toFixed(2)),
                    gains : nGains,
                    losses: nLosses,
                    gainPercent: +((nGains/nClosedTrades)*100).toFixed(2),
                    lossPercent: +((nLosses/nClosedTrades)*100).toFixed(2),
                }
            }

            //console.log(resObj)
            return resObj
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

                if(Object.keys(rowObj).length > 0) { rows.push(rowObj) }
            });
            //console.log(rows)
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
                for(let a = 0; a < e.next.children.length; a++) {
                    let _href = e.next.children[a].children[0].attribs["href"].replace(".",NT_SITE_URL)
                    let _name = e.next.children[a].children[0].children[0].data
                    archive.archives.push({name:_name, href:_href})
                }
                // if(i>1) process.exit(1);
                records.push(archive)
            })
            return records
        });
}

// center2
function archiveContent() {
    return axios.get("https://www.nakedtrader.co.uk/?id=592",{ headers: { Cookie: "nt=1;" } })
        .then(async (resp) => {
            const $ = await cheerio.load(resp.data);
            const sel = '#center2';

            $(sel).each((i, e) => { 
                // console.log($(e).html().replaceAll("<br>",""))
                console.log($(e).text())
            })
        });
}

module.exports = {
    scanTrades,
    scanTrades2,
    scanArchives,
    archiveContent
}

