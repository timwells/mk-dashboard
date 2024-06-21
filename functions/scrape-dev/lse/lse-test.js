(async () => {
    const lseServices = require('./lse-services.js')
    await lseServices['listSectorPeformance']()
    
    console.log("done");
})();
  