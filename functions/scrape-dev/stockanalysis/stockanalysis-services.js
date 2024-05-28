const cheerio = require('cheerio');
const axios = require('axios')
const c = require('../common/c');

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
                const LENGTH = 220
                // Remove '"type": "data",'
                // let stage1 = dmMatch[1].replace(/"type":"data",/g, '');
                let stage1 = dmMatch[1]
                console.log("S1",stage1.substring(0, LENGTH) + " ..... " + stage1.slice(-1*LENGTH));                
                
                // Remove  'theme: void 0,'
                let stage2 = stage1.replace(/theme:void 0,/g, '');
                console.log("S2",stage2.substring(0, LENGTH) + " ..... " + stage2.slice(-1*LENGTH));
                // Remove  "uses":{}

                // let stage3 = stage2.replace(/",uses":{([\s\S]*?)}/g, '');
                let stage3 = stage2
                console.log("S3",stage3.substring(0, LENGTH) + " ..... " + stage3.slice(-1*LENGTH));
                await c.writeFileAsync(`./stage3.json`,stage3);

                // let stage4 = stage3.replace(/"data":/g, 'data:');
                let stage4 = stage3
                console.log("S4",stage4.substring(0, LENGTH) + " ..... " + stage4.slice(-1*LENGTH));
                await c.writeFileAsync(`./stage4.json`,stage4);
                                
                let stage5 = stage4.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, 
                    function(match, p1, p2, p3) {
                        // Add quotes around the key if it doesn't start with a digit
                        if (!/^\d/.test(p2)) { return `${p1}"${p2}"${p3}`; }
                        return match; // Return the original match if the key starts with a digit
                    });
                                    
                console.log("S5",stage5.substring(0, LENGTH) + " ..... " + stage5.slice(-1*LENGTH));
                await c.writeFileAsync(`./stage5.json`,stage5);

                // let stage6 = stage5.replace(/(?:\[|\b)(?:-?\.)\d+/g, '0$&');
                // let stage6 = stage5.replace(/(?:\[|\b)(?:-?\.)\d+(?!\d)/g, '0$&');
                // let stage6 = stage5.replace(/(?:\[|\b)(-?\.)(\d+(\.\d+)?)(?!\d)/g, '0$1$2');
                // let stage6 = stage5.replace(/(-?)(?<=\[|,)\.(\d+)/g, '$10.$2');
                let stage6 = stage5.replace(/(?<=\[|,)(-?)(\.\d+)/g, '$10$2');

                console.log("S6",stage6.substring(0, LENGTH) + " ..... " + stage6.slice(-1*LENGTH));
                await c.writeFileAsync(`./stage6.json`,stage6);



                // Parse JSON Obj
                
                let parsedData;
                try {
                    parsedData = JSON.parse(stage6);
                    console.log(parsedData)
                    await c.writeFileAsync(`./parsedData.json`,JSON.stringify(parsedData));
                }
                catch(error)
                {
                    console.log(error.message)
                }
                

                //try {
                //    let correctedData = JSON.stringify(parsedData, (key, value) => {
                //        console.log(key,value)
                        /*
                        if (typeof value === 'number' && value.toString().startsWith('.')) {
                            return parseFloat('0' + value);
                        }
                        return value;
                        */
                //    });
                //}
                //catch(error) {
                //    console.log(error.message)
                //}

/*
                try {
                    let obj = JSON.parse(stage6)
                    console.log(obj);
                    await c.writeFileAsync(`./stage6_obj.json`,JSON.stringify(obj));

                } catch (error) {
                    console.error('Invalid JSON format:', error.message);
                }
*/
                let obj2 = {}
                obj2.db_symbol = "I3E"
                obj2.es = null
                console.log("O2",obj2)
                // await c.writeFileAsync(`./stage4_obj.json`,JSON.stringify(obj2));

                // let stage3 = stage2.trimStart().trimEnd().replace(/\\"/g, '"')
                // console.log(stage2.substring(0, 100) + " ..... " + stage2.slice(-100));                
                
                // const fStr = sStr.replace(/"([^"]+)":/g, '$1:');                
                //console.log(fStr.substring(0, 100) + " ... " + fStr.slice(-100));   
                //let x = JSON.stringify(fStr)
                //let y = JSON.parse(x);
                //console.log(y);

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
    scanStock2
}

