const cheerio = require('cheerio');
const axios = require('axios')
const c = require('./common/c');

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
    // console.log('nPages: ' + nPages,path)
    return parseInt(nPages)
}

async function getFtseIndex(path,index) {
    console.log(path)
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
                    case 2: row.price = entity; break;
                    case 3: row.change = entity; break;
                    case 4: row.percentage = entity; break;
                    default: break;
                }   
            });
            rows.push(row);
        }
    })
    return rows;
}

async function scanFtse100(){
    await scanFtseDetails('https://www.hl.co.uk/shares/stock-market-summary/ftse-100','ftse-100')
}
async function scanFtse100DetailsPageCount(){
    await getFtseIndexPageCount('https://www.hl.co.uk/shares/stock-market-summary/ftse-100')
}
async function scanFtse250(){
    await scanFtseDetails('https://www.hl.co.uk/shares/stock-market-summary/ftse-250','ftse-250')
}
async function scanFtse250DetailsPageCount(){
    await getFtseIndexPageCount('https://www.hl.co.uk/shares/stock-market-summary/ftse-250')
}
async function scanFtse350(){
    await scanFtseDetails('https://www.hl.co.uk/shares/stock-market-summary/ftse-350','ftse-350')
}
async function scanFtse350DetailsPageCount(){
    await getFtseIndexPageCount('https://www.hl.co.uk/shares/stock-market-summary/ftse-350')
}

async function scanFtseIndexes(){
    let stocks = []
    
    let nPages = await getFtseIndexPageCount('https://www.hl.co.uk/shares/stock-market-summary/ftse-100')
    console.log(nPages, 'ftse-100')

    for(let i = 1; i <= nPages; i++) {
        stocks.push(...await getFtseIndex(`https://www.hl.co.uk/shares/stock-market-summary/ftse-100?page=${i}`,'ftse-100'))
    }

    
    nPages = await getFtseIndexPageCount('https://www.hl.co.uk/shares/stock-market-summary/ftse-250')
    for(let i = 1; i <= nPages; i++) {
        stocks.push(...await getFtseIndex(`https://www.hl.co.uk/shares/stock-market-summary/ftse-250?page=${i}`,'ftse-250'))
    }
    console.log(nPages, 'ftse-250')

    nPages = await getFtseIndexPageCount('https://www.hl.co.uk/shares/stock-market-summary/ftse-350')
    for(let i = 1; i <= nPages; i++) {
        stocks.push(...await getFtseIndex(`https://www.hl.co.uk/shares/stock-market-summary/ftse-350?page=${i}`,'ftse-350'))
    }
    console.log(nPages, 'ftse-350')
    console.log(stocks)
    console.log(stocks.length)

    await c.writeFileAsync(`./stocks.json`,JSON.stringify(stocks));
}

module.exports = {
    scanFtse100,
    scanFtse250,
    scanFtse350,
    scanFtse100DetailsPageCount,
    scanFtse250DetailsPageCount,
    scanFtse350DetailsPageCount,

    scanFtseIndexes
}
