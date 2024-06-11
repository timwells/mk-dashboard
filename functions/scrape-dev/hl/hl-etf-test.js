(async () => {
    const hlServices = require('./hl-etf-services.js')
    await hlServices['listProviders']()
    
    // await hlServices['testDetail']()
    

    console.log("done");
})();
  