const StockAnalysisServices = require('./stockanalysis-services.js')
StockAnalysisServices['scanStock3']().then((d) => {
    console.log("done...",d) 
})

