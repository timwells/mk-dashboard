(async () => {
    const hlServices = require('./hl-etf-services.js')
    await hlServices['listProviders']()

    console.log("done");
})();
  