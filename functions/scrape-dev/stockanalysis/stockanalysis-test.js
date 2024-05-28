const StockAnalysisServices = require('./stockanalysis-services.js')
StockAnalysisServices['scanStock2']().then((d) => {
    console.log("done...",d) 
})

