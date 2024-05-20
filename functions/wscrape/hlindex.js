const cheerio = require('cheerio');
const axios = require('axios');
const c = require('./common/c');
const HL_SHARES_HOST = 'https://www.hl.co.uk/shares/stock-market-summary'

async function getFtseIndexPageCount(path) {
    let { data } = await axios.get(path)
    const $ = await cheerio.load(data)
    const pages = $("table .marketsChangeViewPage")
    let rows = pages.find('tr')
    let nPages = '1';
    if(rows.length > 0) { 
        cols = $(rows[0]).find('td')
        let entity = $(cols[1]).text().replace(/[\n|\t]/gm, '')
        let n = Array.from(entity.split(":")[1])
        nPages = n[n.length - 1]
    }
    return parseInt(nPages)
}

async function getFtseIndex(path,index) {
    let rows = []
    let { data } = await axios.get(path)
    const $ = await cheerio.load(data)
    const listing = $(".stockTable");
    listing.find('tr').each((i, r) => {
        let cols = $(r).find('td');
        if(cols.length === 6) {
            let row = {}
            row.index = index
            cols.each((j, col) => {
                let entity = $(col).text().replace(/[\n|\t]/gm, '')
                switch(j) {
                    case 0: row.epic = entity; break;
                    case 1: row.name = entity; break;
                    case 2: row.price = parseFloat(entity.replace(',','')); break;
                    case 3: row.change = parseFloat(entity.replace(',','')); break;
                    case 4: row.percentage = parseFloat(entity.replace('%','')); break;
                    default: break;
                }   
            });
            rows.push(row);
        }
    })
    return rows
}

const indexes = async (req, res) => {
    let stocks = []    

    // https://www.hl.co.uk/shares/stock-market-summary/ftse-all-share
    let nPages = await getFtseIndexPageCount(`${HL_SHARES_HOST}/ftse-all-share`)
    for(let i = 1; i <= nPages; i++) {
        stocks.push(...await getFtseIndex(`${HL_SHARES_HOST}/ftse-all-share?page=${i}`,'ftse-all-share'))
    }

    /*
    nPages = await getFtseIndexPageCount(`${HL_SHARES_HOST}/ftse-250`)
    for(let i = 1; i <= nPages; i++) {
        stocks.push(...await getFtseIndex(`${HL_SHARES_HOST}/ftse-250?page=${i}`,'ftse-250'))
    }

    nPages = await getFtseIndexPageCount(`${HL_SHARES_HOST}/ftse-100`)
    for(let i = 1; i <= nPages; i++) {
        stocks.push(...await getFtseIndex(`${HL_SHARES_HOST}/ftse-100?page=${i}`,'ftse-100'))
    }
    const uStocks = [...new Map(stocks.map(v => [v.epic, v])).values()]
    */

    // points.sort(function(a, b){return a - b});
    // var res = myarray.sort((a, b) => b.age-a.age);
    res.status(200).json(stocks.sort((a, b) => a.percentage - b.percentage));
}

module.exports = {
    indexes,
}