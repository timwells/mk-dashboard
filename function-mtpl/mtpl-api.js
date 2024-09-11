const axios = require('axios');
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

const dataset = async (ds) => {
    const dataSrc = `${MULTPL_HOST}/${ds}`
    try {
        const {data } = await axios.get(dataSrc)
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
                        value = +parseFloat(entity.replace("%","").replace("†","")); 
                        break;
                    default: break;
                }
            });
            if(i > 0) {
                if (dto > new Date("1989-12-01").getTime()) {
                    rows.push([dto,value]);
                }
            }
        })

        let _name = ds.split("/")[0]
        let dataObj = { name: _name, data: rows.reverse()}

        //dataObj.data = {}
        //dataObj.data.rwdata = rows.reverse()
        //dataObj.data.expMA = expMA(dataObj.data.rwdata,5000)

        return dataObj;
    }
    catch(e) {
        console.log(e)
    }
    return []   
}

module.exports = {
    dataset
}