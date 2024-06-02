const cheerio = require('cheerio');
const axios = require('axios')
const c = require('../common/c');

const I3E = "https://stockanalysis.com/quote/lon/I3E/financials/"
const I3E_CASHFLOW = "https://stockanalysis.com/quote/lon/I3E/financials/cash-flow-statement/"

const PRU = "https://stockanalysis.com/quote/lon/PRU/financials/"

const STOCK = I3E_CASHFLOW

// const STOCK = I3E
async function scanStock2() {
    let path = STOCK
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


                // Replace the matches with leading zeros
                // let stage6 = stage5.replace(/(?<=":\s*)-?\.\d+/g, match => '0' + match);
                
                let stage6 = stage5.replace(/(\.\d+)/g, 
                    (match, p1) => { 
                        console.log(`${p1} => 0${p1}`)
                        return `0${p1}` 
                    }
                )

                console.log("S6",stage6.substring(0, LENGTH) + " ..... " + stage6.slice(-1*LENGTH));
                await c.writeFileAsync(`./stage6.json`,stage6);

                // Parse JSON Obj
                let parsedData;
                try {
                    parsedData = JSON.parse(stage6);
                    if(parsedData.length === 3) {
                    console.log(parsedData[2])
                    }
                    // console.log(parsedData)
                    await c.writeFileAsync(`./parsedData.json`,JSON.stringify(parsedData));
                }
                catch(error)
                {
                    console.log(error.message)
                }                
            }
        }
    }
    catch (err) {}
}

async function scanStock3() {
    let path = STOCK

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
        await c.writeFileAsync(`./scripts.json`,JSON.stringify(scripts));

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
                    });
                // Resolve .Number and -.Number
                // let stage4 = stage3.replace(/(?<=\[|,)(-?)(\.\d+)/g, '$10$2');
                let stage4 = stage3.replace(/(\d+\.\d+)|(-\.\d+)|(\.\d+)/g, (match, p1,p2, p3) => {
                    // (\d+\.\d+) - Do not change
                    if(typeof p1 !== 'undefined') return p1;
                    
                    // (-\.\d+) resolve -.nnn
                    if(typeof p2 !== 'undefined') return `-0.${p2.split(".")[1]}`
        
                    // (\.\d+) resolve .nnn
                    if(typeof p3 !== 'undefined') return `0.${p3.split(".")[1]}`
                })   
                
            
                // Parse JSON Obj
                let parsedData;
                try {
                    parsedData = JSON.parse(stage4);
                    if(parsedData.length === 3) {
                        console.log(parsedData[2])
                    }
                }
                catch(error) {console.log(error.message)}                
            }
        }
    }
    catch (error) { console.log(error.message) }
}

async function scanFinancialRecords(path,name) {
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
                    });
                // Resolve .Number and -.Number
                let stage4 = stage3.replace(/(\d+\.\d+)|(-\.\d+)|(\.\d+)/g, (match, p1,p2, p3) => {
                    // (\d+\.\d+) - Do not change
                    if(typeof p1 !== 'undefined') return p1;
                    
                    // (-\.\d+) resolve -.nnn
                    if(typeof p2 !== 'undefined') return `-0.${p2.split(".")[1]}`
        
                    // (\.\d+) resolve .nnn
                    if(typeof p3 !== 'undefined') return `0.${p3.split(".")[1]}`
                })   
                       
                // Parse JSON Obj
                let parsedData;
                try {
                    parsedData = JSON.parse(stage4);
                    if(parsedData.length === 3) {
                        console.log(parsedData[2])
                        await c.writeFileAsync(`./${name}.json`,JSON.stringify(parsedData[2]));
                    }
                }
                catch(error) {console.log(error.message)}                
            }
        }
    }
    catch (error) { console.log(error.message) }
}

async function scanFinancialRecords2(path,name) {
    try {
        let { data } = await axios.get(path)
        const $ = await cheerio.load(data)
        // const dataTable = $('table[data-test="financials"] tbody');
        
        const dataTable = $('table[data-test="financials"] tbody tr td div[id]');
        dataTable.each((i,e) => {
            console.log(e.attribs["id"]);
        })

        /*
        dataTable.find('tr').each((i, row) => {
            $(row).find('td').each((j, td) => {
                console.log(td.data())
            })
        })
        */
    } catch (e) {
        console.error(e.message);
    }
}



async function scanStock4() {
    let jsonData = `{
        "quote": {
            "a": -.1,
            "b": .2,
            "cl": 10.9,
            "ebitMargin": [-.1827898148859018, .10876847786131996, null, -.0960055996226415, .025764262787326568, -.003190064116241359]
        }
    }`;
    
    let test = 4
    let modifiedData = ""
    if(test === 1) { 
        // Define the regular expression
        let pattern = /(?<=":\s*)-\.\d+|\b\.\d+(?!\d)/g;
        // Replace the matches with leading zeros
        modifiedData = jsonData.replace(pattern, match => { console.log(match); return '0' + match });
    } else if(test === 2) {
        // Resolve .Number and -.Number
        // modifiedData = jsonData.replace(/(?<=\[|,)(-?)(\.\d+)/g, '$10$2');
        modifiedData = jsonData.replace(/(\.\d+)/g, (match, p1) =>
            {
                console.log(match,p1)
                return `0${p1}`
            })   
    }
    else if(test === 3) {
        // Resolve .Number and -.Number
        // modifiedData = jsonData.replace(/(?<=\[|,)(-?)(\.\d+)/g, '$10$2');
        modifiedData = jsonData.replace(/(\d+\.\d+)|(-\.\d+)|(\.\d+)/g, (match, p1,p2, p3) =>
        {
            // Do not change
            if(typeof p1 !== 'undefined') {
                console.log("p1",p1, "=>", p1); return p1;
            }
            
            // split  -0.${p2}`)
            if(typeof p2 !== 'undefined') {
                let _p2 =p2.split(".");
                console.log("p2",_p2,p2, "=>", `-0.${_p2[1]}`); return `-0.${_p2[1]}`;}

            // 
            if(typeof p3 !== 'undefined') {
                let _p3 =p3.split(".");
                console.log("p3",p3.split("."),p3, "=>", `0.${_p3[1]}`); return `0.${_p3[1]}`;}
        })   
    }
    else if(test === 4) {
        modifiedData = jsonData.replace(/(\d+\.\d+)|(-\.\d+)|(\.\d+)/g, (match, p1,p2, p3) => {
            // (\d+\.\d+) - Do not change
            if(typeof p1 !== 'undefined') return p1;
            
            // (-\.\d+) resolve -.nnn
            if(typeof p2 !== 'undefined') return `-0.${p2.split(".")[1]}`

            // (\.\d+) resolve .nnn
            if(typeof p3 !== 'undefined') return `0.${p3.split(".")[1]}`
        })   
    }

    
    console.log("jsonData",jsonData);    
    console.log("================================================");
    console.log("modifiedData",modifiedData);
    console.log("================================================");


    // Parse the modified JSON
    try {
        let parsed = JSON.parse(modifiedData);
        console.log(parsed);
    } catch (e) {
        console.log(e.message);
    }
}


async function scanFinancials(){
    let fd = 
    [
        { path:"https://stockanalysis.com/quote/lon/I3E/financials/",
            name:"income" },
        { path:"https://stockanalysis.com/quote/lon/I3E/financials/cash-flow-statement/",
            name:"cash-flow-statement" },
        { path:"https://stockanalysis.com/quote/lon/I3E/financials/balance-sheet/",
            name:"balance-sheet" },
        { path:"https://stockanalysis.com/quote/lon/I3E/financials/ratios/",
            name:"ratios" }
    ]

    for(i=0; i<fd.length; i++){
        await scanFinancialRecords(fd[i].path, fd[i].name)
    }
}

async function scanFinancials2(){
    let fd = 
    [
        { path:"https://stockanalysis.com/quote/lon/I3E/financials/",
            name:"income" },
        /*
        { path:"https://stockanalysis.com/quote/lon/I3E/financials/cash-flow-statement/",
            name:"cash-flow-statement" },
        { path:"https://stockanalysis.com/quote/lon/I3E/financials/balance-sheet/",
            name:"balance-sheet" },
        { path:"https://stockanalysis.com/quote/lon/I3E/financials/ratios/",
            name:"ratios" }
        */
    ]

    for(i=0; i<fd.length; i++){
        await scanFinancialRecords2(fd[i].path, fd[i].name)
    }
}

module.exports = {
    scanStock2,
    scanStock3,
    scanStock4,
    scanFinancials,
    scanFinancials2
}

