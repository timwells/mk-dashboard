const axios = require('axios')
const cMod = require('./common/c')

const financials1 = async (req, res) => {
    let exchange = req.query.exchange
    let symbol = req.query.symbol
    const _URL2 = `https://stockanalysis.com/quote/${exchange}/${symbol}/financials/`

    try {
        let { data } = await axios.get(_URL2)
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
                let stage2 = stage1.replace(/theme:void 0,/g, '');
                // Quote Attributes
                let stage3 = stage2.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, 
                    (match, p1, p2, p3) => {
                        // Add quotes around the key if it doesn't start with a digit
                        if (!/^\d/.test(p2)) { return `${p1}"${p2}"${p3}`; }
                            // Return the original match if the key starts with a digit                        
                        return match; 
                    })

                // Resolve .Number and -.Number need leading '0'
                // let stage4 = stage3.replace(/(\.\d+)/g, (match, p1) => { return `0${p1}`})
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
                    res.status(200).json(JSON.parse(stage4))
                    break;
                }
                catch(error) {
                    res.status(500).send(error.message);
                }                
            }
        }
    }
    catch (error) { 
        res.status(500).send(error.message);
    }
}

const getFinancialDetails = async (path, name) => {
    try {
        let { data } = await axios.get(path)

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

                    console.log(parsedData)

                    if(parsedData.length === 3) { return parsedData[2] }
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

const test = async (req, res) => {
    res.status(200).send("test : " + _URL);
}
  
module.exports = {
    test,
    financials,
    financials1
}
