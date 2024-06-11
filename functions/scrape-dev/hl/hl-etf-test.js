(async () => {
    const hlServices = require('./hl-etf-services.js')
    // await hlServices['listProviders']()
    await hlServices['mergeProviders']()
    
    console.log("done");
})();
  