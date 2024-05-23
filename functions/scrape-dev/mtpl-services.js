const axios = require('axios');
const moment = require('moment')
const cheerio = require('cheerio');

// https://www.multpl.com/
// https://www.multpl.com/shiller-pe/table/by-month
// https://www.multpl.com/s-p-500-pe-ratio/table/by-year
// https://www.multpl.com/s-p-500-price-to-book/table/by-quarter


// https://www.multpl.com/1-month-treasury-rate


// const SHILLER_SITE = "https://www.multpl.com/shiller-pe/table/by-month"
/*
const dataset = (req, res) => {
    let shillerpe = [] 
    axios.get(SHILLER_SITE)
        .then(async (resp) => {
            const $ = await cheerio.load(resp.data);
            $('#datatable > tbody > tr').each((i, el) => {
                if(i > 0) {
                    const rowCols = $(el).children("td")
                    const dateObj = new Date(rowCols[0].children[0].data)
                    const valStr = rowCols[1].children[0].data.trimStart().trimEnd()                    
                    shillerpe.push({d: dateObj.toLocaleDateString(),v:valStr})
                }
            })
            res.status(200).json(shillerpe.reverse());
        })
    }
*/
const _1_MONTH_TREASURE_RATE_BY_MONTH = "https://www.multpl.com/1-month-treasury-rate/table/by-month"
const _5_YEAR_TREASURE_RATE_BY_MONTH = "https://www.multpl.com/5-year-treasury-rate/table/by-month"
const _SHILLER_PE_RATIO_BY_MONTH = "https://www.multpl.com/shiller-pe/table/by-month"
const _SP500_DIVIDEND_YIELD = "https://www.multpl.com/s-p-500-dividend-yield/table/by-month"

async function scanTest2 () {
    const dataSrc = _SP500_DIVIDEND_YIELD
    const { meta, data } = await axios.get(dataSrc)
    const $ = await cheerio.load(data);
    const table = $("#datatable")
    let rows = []

    table.find('tr').each((i, r) => {    
        let cols = $(r).find('td');
        let obj = {}
        cols.each((j, col) => {
            let entity = $(col).text().replace(/[\n|\t]/gm, '').trimStart().trimEnd()
            switch(j) {
                case 0: obj.date = moment(entity, 'MMM DD, YYYY').format('YYYY-MM-DD'); break;
                case 1: obj.value = parseFloat(entity.replace("%","").replace("†","")); break;
                default: break;
            }
        });
        if(i > 0) rows.push(obj);
    })
    console.log(rows)
}

async function scanTest () {
    console.log("scanTest")
}

module.exports = {
    // dataset,
    scanTest,
    scanTest2
}