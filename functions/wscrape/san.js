const axios = require('axios')
const cheerio = require('cheerio');

const cMod = require('./common/c')

const getFinancialDetails = async (path, name) => {
    try {
        let { data } = await axios.get(path)

        // Extract Display Rows
        const $ = await cheerio.load(data)
        let rowIds = []
        const dataTable = $('table[data-test="financials"] tbody tr td div[id]');
        dataTable.each((i,e) => {
            rowIds.push(e.attribs["id"]);
        })

        // Match script tags and their content
        const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;

        // Match data and content
        const dataRegex = /const data =([\s\S]*?);/
        let match;
        let scripts = []
        while ((match = scriptRegex.exec(data)) !== null) {
            const scriptContent = match[1];
            scripts.push(scriptContent.trimStart().trimEnd())
        }
        let dmMatch;
        for(let i = 0; i < scripts.length; i++) {
            let bR = dataRegex.test(scripts[i]);
            if(bR) { // If matches data regex
                dmMatch = dataRegex.exec(scripts[i])
                let stage1 = dmMatch[1]
                // Remove  'theme: void 0,'
                // let stage2 = stage1.replace(/theme:void 0,/g, '');
                let stage2 = stage1.replace(/void 0/g, 'null');
                // Quote Attributes
                let stage3 = stage2.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, 
                    (match, p1, p2, p3) => {
                        // Add quotes around the key if it doesn't start with a digit
                        if (!/^\d/.test(p2)) { return `${p1}"${p2}"${p3}`; }
                            // Return the original match if the key starts with a digit                        
                        return match; 
                    })

                // Resolve .Number and -.Number need leading '0'
                let stage4 = stage3.replace(/(\d+\.\d+)|(-\.\d+)|(\.\d+)/g, (match, p1,p2, p3) => {
                        // (\d+\.\d+) - Do not change
                        if(typeof p1 !== 'undefined') return p1;
                        // (-\.\d+) resolve -.nnn
                        if(typeof p2 !== 'undefined') return `-0.${p2.split(".")[1]}`
                        // (\.\d+) resolve .nnn
                        if(typeof p3 !== 'undefined') return `0.${p3.split(".")[1]}`
                })

                // Parse / send JSON Obj
                try {
                    let parsedData = JSON.parse(stage4);
                    
                    if(parsedData.length === 3) { 
                        parsedData[2].data.rowIds = rowIds    
                        return parsedData[2]                    
                    }
                }
                catch(error) {
                    return {}
                }                
            }
        }
    }
    catch (error) { 
        return {}
    }
}

const financials = async (req, res) => {
    let exchange = req.query.exchange
    let symbol = req.query.symbol
    const basePath = `https://stockanalysis.com/quote/${exchange}/${symbol}`
    let resources = [
        `${basePath}/financials/`,
        `${basePath}/financials/cash-flow-statement/`,
        `${basePath}/financials/balance-sheet/`,
        `${basePath}/financials/ratios/`
    ]

    try {
        let resObj = [];        
        for(let i = 0; i < resources.length; i++) {
            resObj.push(await getFinancialDetails(resources[i],""))
        }

        res.status(200).json(resObj)
    } 
    catch (e) {
        res.status(500).send(error.message);
    }
}

const financials2 = async (req, res) => {
    let exchange = req.query.exchange
    let symbol = req.query.symbol
    const basePath = `https://stockanalysis.com/quote/${exchange}/${symbol}`
    let resources = [
        `${basePath}/financials/`
    ]

    try {
        let resObj = [];
        for(let i = 0; i < resources.length; i++) {
                        
            resObj.push(await getFinancialDetails(resources[i],""))
        }

        let entityMap = new Map();
        for(let j = 0; j < resObj[0].data["map"].length; j++) {
        {
            entityMap.set(resObj[0].data["map"][j].id,resObj[0].data["map"][j])}
        }

        delete resObj[0].data["map"]
        resObj[0].data.entityMap = Array.from(entityMap.entries())

        res.status(200).json(resObj[0])
    } 
    catch (e) {
        res.status(500).send(error.message);
    }
}

/*
Income Statement
Year                            2023	2022	2021	2020	2019	2018 - 2015
Revenue                         146.31	208.44	86.76	12.99	0	Upgrade
Revenue Growth (YoY)            -29.80%	140.24%	567.87%	-	-	Upgrade
Cost of Revenue                 110.3	113.42	61.13	13.14	0.01	Upgrade
Gross Profit                    36.01	95.01	25.64	-0.15	-0.01	Upgrade
Selling, General & Admin	    9.98	14.42	12.98	5.7	7.46	Upgrade
Operating Expenses	            9.98	14.42	12.98	5.7	7.46	Upgrade
Operating Income	            26.04	80.59	12.66	-5.86	-7.47	Upgrade
Interest Income	0.64	        5.7	5.97	4.84	3.62	Upgrade
Interest Expense	            7.6	5.72	6.34	4.96	3.62	Upgrade
Other Expense / Income	        -1.82	24.79	-13.46	-16.58	3.38	Upgrade
Pretax Income	                20.9	55.78	25.74	10.61	-10.85	Upgrade
Income Tax	5.75	            13.83	0.66	-1.11	-0	Upgrade
Net Income	15.15	            41.95	25.08	11.72	-10.85	Upgrade
Net Income Growth	            -63.89%	67.25%	114.06%	-	-	Upgrade
Shares Outstanding (Basic)	    1199	1164	884	310	81	Upgrade
Shares Outstanding (Diluted)    1217	1224	966	339	81	Upgrade
Shares Change	                -0.58%	26.77%	184.90%	319.18%	112.50%	Upgrade
EPS (Basic)	                    0.01	0.04	0.03	0.04	-0.13	Upgrade
EPS (Diluted)	                0.01	0.03	0.03	0.03	-0.13	Upgrade
EPS Growth	                    -63.85%	31.92%	-24.86%	-	-	Upgrade
Free Cash Flow	                21.66	20.55	11.21	-22.03	-26.22	Upgrade
Free Cash Flow Per Share	    0.02	0.02	0.01	-0.06	-0.32	Upgrade
Gross Margin	                24.61%	45.58%	29.55%	-1.17%	-	Upgrade
Operating Margin	            17.79%	38.67%	14.59%	-45.07%	-	Upgrade
Profit Margin	                10.35%	20.13%	28.91%	90.20%	-	Upgrade
Free Cash Flow Margin	        14.80%	9.86%	12.92%	-169.56%	-	Upgrade
Effective Tax Rate	            27.52%	24.79%	2.57%	-10.46%	-	Upgrade
EBITDA	67.04	                117.6	35.84	-0.79	-7.46	Upgrade
EBITDA Margin	                45.82%	56.42%	41.31%	-6.06%	-	Upgrade
Depreciation & Amortization	    41	37.01	23.18	5.07	0.01	Upgrade
EBIT	                        26.04	80.59	12.66	-5.86	-7.47	Upgrade
EBIT Margin	                    17.79%	38.67%	14.59%	-45.07%	-	Upgrade
*/


const test = async (req, res) => {
    res.status(200).send("test : " + _URL);
}
  
module.exports = {
    test,
    financials,
    financials2
}
