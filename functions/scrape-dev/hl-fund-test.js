const hlServices = require('./hl-fund-services.js')

let result = hlServices['scanFunds1']()
//let result = hlServices['testFundSplit']()
result.then((d) => { 
    console.log("done...") 
})
