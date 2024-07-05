const path = require('path');
const fs = require('fs')
const fsPromises = fs.promises;
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios')

function version() { return "1.0" }

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

function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

async function getFilesByPattern(directory, pattern) {
    let pf = [];
    let files = await fsPromises.readdir(directory);
    for(let i = 0; i < files.length; i++) {
      let bInclude = false;
      if(pattern === "*") {
        bInclude = true;
      }
      else if(new RegExp(pattern).test(files[i])) {
        bInclude = true;
      }
      else { /* Do nothing */ }
      if(bInclude) {
        pf.push(directory + '/'+ files[i])
      }
    }
    return pf;
}


async function sText(text, maxLength) {
  // Check if the text needs to be shortened
  if (text.length > maxLength) {
      // Return the shortened text with ellipsis
      return text.substring(0, maxLength - 3) + '...';
  } else {
      // Return the original text if it's within the limit
      return text;
  }
}

async function getContent(url,) {
  console.log(url)
  try {
      // const { data } = await axios.get(url, { headers: HEADERS});
      const { data } = await axios.get(url);
      console.log(data.statusCode)
      // console.log(data)
      const $ = await cheerio.load(data)
      return $
  }
  catch(e) {
      console.log("getContent:",e.message)
  }
  return null
}

module.exports = {
    sText,
    version,
    getPuppetInstance,
    sleep,
    initStopWatch,
    watchTimeNow,
    writeFileAsync,
    readFileAsync,
    toCSV,
    randomInt,
    getFilesByPattern,
    getContent
}
