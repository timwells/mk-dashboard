const puppeteer = require('puppeteer');

let gPuppetInstance = null
async function getPuppetInstance() {
    if(!gPuppetInstance) {
        gPuppetInstance = await puppeteer.launch({headless: 'new'})   
    }
    return gPuppetInstance
}

const sleep = (ms) => new Promise(res => setTimeout(res, ms));


function isCacheExpired(metadata) {
    try {
      // Extract the cacheControl metadata
      const cacheControl = metadata.cacheControl;
  
      if (!cacheControl) {
        // console.log('No cacheControl metadata found.');
        return false;
      }
  
      // Parse max-age value from cacheControl
      const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
      if (!maxAgeMatch) {
        // console.log('No max-age directive found in cacheControl.');
        return false;
      }
  
      const maxAgeSeconds = parseInt(maxAgeMatch[1], 10);
  
      // Get the time when the file was last updated
      const updatedTime = new Date(metadata.updated);
      const currentTime = new Date();
  
      // Calculate the age of the cached content in seconds
      const ageInSeconds = (currentTime - updatedTime) / 1000;
  
      // Determine if the cache has expired
      const isExpired = ageInSeconds > maxAgeSeconds;
  
      // console.log(`Cache age: ${ageInSeconds} seconds, Max age: ${maxAgeSeconds} seconds, Expired: ${isExpired}`);
      return isExpired;
  
    } catch (error) {
        console.error('Error checking cache expiration:', error);
        return false;
    }
}
  
module.exports = {
    getPuppetInstance,
    sleep,
    isCacheExpired
}
