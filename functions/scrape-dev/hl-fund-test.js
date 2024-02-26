const hlServices = require('./hl-fund-services.js')

let result = hlServices['scanFunds1']()
result.then((d) => { 
    console.log("done...") 
})
