(async () => {
    const fvzServices = require('./fvz-services.js')
    // await fvzServices['getNews']()
    
    await fvzServices['getIndustryForwardPE']()

    console.log("done");
    process.exit()
})();
  