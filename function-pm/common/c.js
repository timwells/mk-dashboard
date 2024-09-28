// const puppeteer = require('puppeteer');

const puppeteer = require('puppeteer-extra')
 
// add stealth plugin and use defaults (all evasion techniques) 
const StealthPlugin = require('puppeteer-extra-plugin-stealth') 
puppeteer.use(StealthPlugin()) 

let gPuppetInstance = null
async function getPuppetInstance() {
    if(!gPuppetInstance) {
        gPuppetInstance = await puppeteer.launch({headless: 'new'})   
    }
    return gPuppetInstance
}
async function closePuppetInstance() {
    if(gPuppetInstance) {
        await gPuppetInstance.close()
    }
    gPuppetInstance = null
}


// const sleep = (ms) => new Promise(res => setTimeout(res, ms));
module.exports = {
    getPuppetInstance,
    closePuppetInstance
}