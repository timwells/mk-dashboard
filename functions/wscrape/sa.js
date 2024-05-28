const axios = require('axios')
const _URL = "https://stockanalysis.com/quote/lon/I3E/financials/"

const financials = async (req, res) => {
    try {
        let { data } = await axios.get(_URL)
        // Regular expression to match script tags and their content
        const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
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
            if(bR) {
                dmMatch = dataRegex.exec(scripts[i])
                let sStr = dmMatch[1].trimStart().trimEnd().replace(/\\"/g, '"')
                
                const fStr = sStr.replace(/"([^"]+)":/g, '$1:');                
                let x = JSON.stringify(fStr)
                let y = JSON.parse(x);

                res.status(200).send(y);
            }
        }
    }
    catch (err) {
        res.status(501).json(err);
    }
}

const test = async (req, res) => {
    res.status(200).send("sa : " + _URL);
  }
  
module.exports = {
    test,
    financials
}
