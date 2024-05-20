const mtplServices = require('./mtpl-services.js')

let r = mtplServices['scanTest2']()
r.then((d) => { 
    console.log("done...") 
})
