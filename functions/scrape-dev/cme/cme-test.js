const cmeServices = require('./cme-services.js')

// let result = tgeServices['getCommodities']()
let result = cmeServices['getFedRateProbabilites']()
result.then((d) => { 
    console.log("done...") 
})
