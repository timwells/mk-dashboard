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
    archives
}
