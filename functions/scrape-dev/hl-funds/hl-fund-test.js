const hlServices = require('./hl-fund-services.js')
//const hlIndexServices = require('./hl-index-services.js')

//let result = hlServices['cleanFunds']()
// let result = hlServices['mergeFunds']()
//let result = hlServices['scanFunds1']()
//let result = hlServices['testFundSplit']()

// scanFtse100DetailsPageCount
//let result = hlIndexServices['scanFtseIndexes']()
//result.then((d) => { 
//    console.log("done...") 
//})



// Process HL Funds: Names, prices, composition
// let result = hlServices['scanFunds'](0)
//let result = hlServices['getFundDetailsTest']()
// let result = hlServices['mergeFunds']()
//let result = hlServices['validateFunds']()
// let result = hlServices['reformatFunds']()

let result = hlServices['queryFunds']()

result.then((d) => { 
    console.log("done...") 
})
