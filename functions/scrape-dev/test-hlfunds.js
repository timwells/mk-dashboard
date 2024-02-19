const hlServices = require('./hl-fund-services.js')

let result = hlServices['scanFunds']()
result.then((d) => { 
    console.log("done...") 
})
