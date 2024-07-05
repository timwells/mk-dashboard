const tgeServices = require('./tge-services.js')

// let result = tgeServices['getCommodities']()
let result = tgeServices['getLttWiltshire5000']()
result.then((d) => { 
    console.log("done...") 
})
