const puppeteer = require('puppeteer');
const fs = require('fs')
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)

let gPuppetInstance = null
async function getPuppetInstance() {
    if(!gPuppetInstance) {
        gPuppetInstance = await puppeteer.launch({headless: 'new'})   
    }
    return gPuppetInstance
}
const sleep = ms => new Promise(res => setTimeout(res, ms));

let startTime = 0
function initStopWatch() {
    startTime = new Date().getTime();
}
function watchTimeNow(tag,reset) {
    console.log(`${tag} : ${new Date().getTime() - startTime}`)
    if(reset) initStopWatch()
}

function toCSV(arr,delim) {
    const array = [Object.keys(arr[0])].concat(arr)
    return array.map(it => {
      return Object.values(it).join(delim);
    }).join('\n')
  }


module.exports = {
    getPuppetInstance,
    sleep,
    initStopWatch,
    watchTimeNow,
    writeFileAsync,
    readFileAsync,
    toCSV
}
