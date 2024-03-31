const gotServices = require('./got-dev.js')

let result = gotServices['listBlogs']()
result.then((d) => { 
    console.log("done...") 
})
