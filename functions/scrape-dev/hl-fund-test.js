const hlServices = require('./hl-fund-services.js')
const hlIndexServices = require('./hl-index-services.js')

//let result = hlServices['cleanFunds']()
// let result = hlServices['mergeFunds']()
//let result = hlServices['scanFunds1']()
//let result = hlServices['testFundSplit']()
// scanFtse100DetailsPageCount
let result = hlIndexServices['scanFtseIndexes']()
result.then((d) => { 
    console.log("done...") 
})
