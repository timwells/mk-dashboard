const puppeteer = require('puppeteer');

let gPuppetInstance = null
async function getPuppetInstance() {
    if(!gPuppetInstance) {
        gPuppetInstance = await puppeteer.launch({headless: 'new'})   
    }
    return gPuppetInstance
}

// const sleep = (ms) => new Promise(res => setTimeout(res, ms));

module.exports = {
    getPuppetInstance,
}