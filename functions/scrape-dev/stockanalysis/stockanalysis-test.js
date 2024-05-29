const StockAnalysisServices = require('./stockanalysis-services.js')
StockAnalysisServices['scanStock4']().then((d) => {
    console.log("done...",d) 
})

