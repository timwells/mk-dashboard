const axios = require('axios');
const cheerio = require('cheerio');

const MULTPL_HOST = "https://www.multpl.com"
const datasettest = async (req, res) => {
    let ds = req.query.ds
    res.status(200).send(`dataset: ${ds}`);
}

const dataset = async (req, res) => {
    const dataSrc = `${MULTPL_HOST}/${req.query.ds}`

    let dataObj = { ds: req.query.ds, rows: [] }

    try {
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
                    case 0: obj.date = entity; break;
                    case 1: obj.value = parseFloat(entity.replace("%","").replace("†","")); break;
                    default: break;
                }
            });
            if(i > 0) rows.push(obj);
        })

        dataObj.rows = rows.reverse()
        res.status(200).json(dataObj);
    }
    catch(e) {
        res.status(400).json(dataObj);
    }   
}

module.exports = {
    datasettest,
    dataset
}