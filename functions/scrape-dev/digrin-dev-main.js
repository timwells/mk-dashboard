const siteServices = require('./digrin-dev.js')

let result = siteServices['dgbTest']()
result.then((d) => { console.log("done...") })
