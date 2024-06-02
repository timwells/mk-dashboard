const StockAnalysisServices = require('./stockanalysis-services.js')
StockAnalysisServices['scanFinancials2']().then((d) => {
    console.log("done...",d) 
})

