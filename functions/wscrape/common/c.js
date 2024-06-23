const puppeteer = require('puppeteer');

let gPuppetInstance = null
async function getPuppetInstance() {
    if(!gPuppetInstance) {
        gPuppetInstance = await puppeteer.launch({headless: 'new'})   
    }
    return gPuppetInstance
}

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

function minsTimeDiff(isoString1, isoString2) {
    // Parse the ISO strings into Date objects
    const date1 = new Date(isoString1);
    const date2 = new Date(isoString2);
  
    // Calculate the difference in milliseconds
    const msDiff = Math.abs(date2 - date1);
  
    // Convert the difference to hours
    const minDiff = msDiff / (1000 * 60);
  
    return minDiff;
  }

module.exports = {
    getPuppetInstance,
    sleep,
    minsTimeDiff
}
