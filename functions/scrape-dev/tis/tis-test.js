(async () => {
    const lseServices = require('./tis-services.js')
    await lseServices['listSectorPeformance2']()
    
    console.log("done");
})();
  