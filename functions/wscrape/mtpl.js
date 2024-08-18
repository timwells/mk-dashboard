const axios = require('axios');
const moment = require('moment')
const cheerio = require('cheerio');

const MULTPL_HOST = "https://www.multpl.com"
/*
{
    "dts": "1872-01-01",
    "dto": -3092601600000,
    "entity": "Jan 1, 1872",
    "dto2": -3092601600000,
    "v": 11.9
},
*/

function expMA(data, periods) {
    // Ensure the data is sorted by date
    // data.sort((a, b) => new Date(a.date) - new Date(b.date));

    const alpha = 2 / (periods + 1);
    const emaData = [];

    // Initialize the EMA with the first value
    let ema = data[0][1];

    // Calculate the EMA for each data point
    data.forEach((point, index) => {
        if (index === 0) {
            emaData.push([point[0],point[1]]);
        } else {
            ema = alpha * point[1] + (1 - alpha) * ema;
            emaData.push([point[0],+ema.toFixed(2)]);
        }
    });

    return emaData;
}

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
        
        let dto = 0.0
        let value = 0.0
        table.find('tr').each((i, r) => {    
            let cols = $(r).find('td');
            let obj = {}
            cols.each((j, col) => {
                let entity = $(col).text().replace(/[\n|\t]/gm, '').trimStart().trimEnd()
                switch(j) {
                    case 0: {
                        obj.dts = moment(entity, 'MMM DD, YYYY').format('YYYY-MM-DD'); 
                        obj.dto = Date.parse(obj.dts);

                    } break;
                    case 1: obj.v = parseFloat(entity.replace("%","").replace("†","")); break;
                    default: 
                        break;
                }
            });
            if(i > 0) rows.push(obj);
        })

        dataObj.rows = rows.reverse()
        dataObj.expMA = expMA(dataObj.rows,5000)

        res.status(200).json(dataObj);
    }
    catch(e) {
        res.status(400).json(dataObj);
    }   
}

const dataset2 = async (req, res) => {
    const dataSrc = `${MULTPL_HOST}/${req.query.ds}`
    try {
        const { meta, data } = await axios.get(dataSrc)
        const $ = await cheerio.load(data);
        const table = $("#datatable")
        let rows = []

        table.find('tr').each((i, r) => {    
            let cols = $(r).find('td');
            let dto = 0.0
            let value = 0.0
            cols.each((j, col) => {
                let entity = $(col).text().replace(/[\n|\t]/gm, '').trimStart().trimEnd()
                switch(j) {
                    case 0: {
                        // obj.dts = moment(entity, 'MMM DD, YYYY').format('YYYY-MM-DD'); 
                        dto = Date.parse(entity);
                    } break;
                    case 1: 
                        value = +parseFloat(entity.replace("%","").replace("†","")); break;
                    default: break;
                }
            });
            if(i > 0) {
                if (dto > new Date("1989-12-01").getTime()) {
                    rows.push([dto,value]);
                }
            }
        })

        let _name = req.query.ds.split("/")[0]
        let dataObj = { name: _name, data: rows.reverse()}

        //dataObj.data = {}
        //dataObj.data.rwdata = rows.reverse()
        //dataObj.data.expMA = expMA(dataObj.data.rwdata,5000)

        res.status(200).json(dataObj);
    }
    catch(e) {
        res.status(400).json(dataObj);
    }   
}

module.exports = {
    datasettest,
    dataset,
    dataset2
}