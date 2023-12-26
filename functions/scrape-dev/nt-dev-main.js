

//const getAccessToken = require('./lib/twitter');
//(async function () {
//    var accessToken = await getAccessToken();
//    console.log(accessToken);
//})()

let site = "nt-dev";
let service = "scanTrades";
const siteServices = require('./nt-dev.js')

// console.log(siteServices)

let result = siteServices['scanTrades2']()
result.then((d) => { console.log("done...") })
