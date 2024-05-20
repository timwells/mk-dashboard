const axios = require('axios');
const cheerio = require('cheerio');
const DATAROMA = "https://www.dataroma.com"
const DATAROMA_HOME = "https://www.dataroma.com/m/home.php"

const scrapedata = (req, res) => {
    axios.get(DATAROMA_HOME)
        .then(async (resp) => {
            let sivs = []
            const $ = await cheerio.load(resp.data);
            const sel = '#port_body ul li a'
            $(sel).each((i, e) => {
              sivs.push({
                name: $(e)[0].children[0].data,
                lastUpdate: $(e)[0].children[1].children[0].data.trimStart().replace("Updated",""),
                detail: $(e).attr("href")
              })
            });
            res.status(200).json(sivs.sort((a, b) => a.name.localeCompare(b.name)));
        });
}

// https://www.dataroma.com/m/holdings.php?m=FS")
const scrapedata1 = (req, res) => {
    // res.status(200).send(`${DATAROMA}${req.query}`)
    axios.get(`${DATAROMA}${req.query.q}`)
        .then(async (resp) => {
            const $ = await cheerio.load(resp.data);
            const sel= '#grid tr'
            const holdings = [];
      
            $(sel).each((i, e) => {
                if(0 == i) {
                    $(e).find("td").each((i, e) => {});
                } else {
                    const holding = {}
                    $(e).find("td").each((i, e) => {
                        const text = $(e).text().trim();
                        switch(i) {
                            case 1: holding.stock = text; break;
                            case 2: holding.portfolio = text; break;
                            case 3: holding.recentActivity = text; break;
                            case 4: holding.share = text; break;
                            case 5: holding.reportedPrice = text; break;
                            case 6: holding.value = text; break;
                            case 8: holding.currentPrice = text; break;
                            case 9: holding.deltaReportedPrice = text; break;
                            case 10: holding.weekLow = text; break;
                            case 11: holding.weekHigh = text; break;
                        }
                    });
                    holdings.push(holding);
                }
            })
            res.status(200).json(holdings.sort((a, b) => a.stock.localeCompare(b.stock)));
        })
}

module.exports = {
    scrapedata,
    scrapedata1
}
