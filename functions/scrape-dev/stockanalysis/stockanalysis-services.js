const cheerio = require('cheerio');
const axios = require('axios')

async function scanStock() {
    let path = "https://stockanalysis.com/quote/lon/I3E/financials/"
    try {
        let { data } = await axios.get(path)
        const $ = cheerio.load(data)

        const scripts = $('#');




        console.length("scripts:", scripts)

        // Iterate over the selected elements and extract their contents
        scripts.each((i, script) => {
            const scriptContent = $(script).html();
            console.log(`Script ${i + 1}:`);
            console.log(scriptContent);
            console.log('-------------------------');
        })
    } catch (e) {
    }
}

async function scanStock1() {
    let path = "https://stockanalysis.com/quote/lon/I3E/financials/"
    try {
        let { data } = await axios.get(path)

        // Regular expression to match script tags and their content
        const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;

        let match;
        while ((match = scriptRegex.exec(data)) !== null) {
            const scriptContent = match[1];
            console.log('Script Content:');
            console.log(scriptContent.trim());
            console.log('-------------------------');
        }
    }
    catch (err) {}
}

async function scanStock2() {
    let path = "https://stockanalysis.com/quote/lon/I3E/financials/"
    try {
        let { data } = await axios.get(path)
        // Regular expression to match script tags and their content
        const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
        const dataRegex = /const data =([\s\S]*?);/

        let match;
        let scripts = []
        while ((match = scriptRegex.exec(data)) !== null) {
            const scriptContent = match[1];
            scripts.push(scriptContent.trimStart().trimEnd())
        }
        console.log(scripts.length);
        // console.log(scripts)
        let dmMatch;
        for(let i = 0; i < scripts.length; i++) {
            console.log(i,scripts[i].substring(0, 200) + "...")
            let bR = dataRegex.test(scripts[i]);
            console.log(`scripts[${i}] ${bR}`)

            if(bR) {
                dmMatch = dataRegex.exec(scripts[i])
                let sStr = dmMatch[1].trimStart().trimEnd().replace(/\\"/g, '"')
                //console.log(sStr.substring(0, 60) + " ..... " + sStr.slice(-60));                
                
                const fStr = sStr.replace(/"([^"]+)":/g, '$1:');                
                //console.log(fStr.substring(0, 100) + " ... " + fStr.slice(-100));   
                let x = JSON.stringify(fStr)
                let y = JSON.parse(x);
                console.log(y);

                //const sObj = JSON.stringify(jObj).replace(/"([^"]+)":/g, '$1:');
                //console.log(sObj)

                //let sObj = JSON.stringify(dmMatch[1].trimStart().trimEnd())
                //console.log(sObj.substring(0, 50) + " ... " + sObj.slice(-50));                
                //let pObj = JSON.parse(sObj.trimStart().trimEnd())
                // console.log(pObj.substring(0, 50) + " ... " + pObj.slice(-50));
                //console.log(">>>",JSON.stringify(pObj).replace(/"\\([^"]+)":/g, '$1:'));
            

/*
const jsonString = '{"name": "John", "age": 30, "city": "New York"}';

// Parse the JSON string to a JavaScript object
const jsonObject = JSON.parse(jsonString);

// Convert the JavaScript object to a string with custom formatting
const formattedString = JSON.stringify(jsonObject, null, 2)
    .replace(/"([^"]+)":/g, '$1:');

console.log(formattedString);                
*/


            }
        }
    }
    catch (err) {}
}

module.exports = {
    scanStock,
    scanStock1,
    scanStock2
}

