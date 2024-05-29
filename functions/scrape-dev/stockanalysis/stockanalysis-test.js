const StockAnalysisServices = require('./stockanalysis-services.js')
StockAnalysisServices['scanFinancials']().then((d) => {
    console.log("done...",d) 
})

