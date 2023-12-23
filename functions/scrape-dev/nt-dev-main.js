

//const getAccessToken = require('./lib/twitter');
//(async function () {
//    var accessToken = await getAccessToken();
//    console.log(accessToken);
//})()

let site = "nt-dev";
let service = "scanTrades";
const siteServices = require('./nt-dev.js')

console.log(siteServices)

//let result = siteServices.scanTrades()
// let result = siteServices['scanTrades']()
let result = siteServices['scanArchives']()
result.then((d) => { console.log(d) })


//(async () => {
    //let site = "nt-dev";
    //let service = "scanTrades";
    //const siteServices = require(`./${site}.js`)
    //let data = await siteServices[service]()
    //console.log(await siteServices)

    //console.log("done");
//})();

/*
(async () => {
    // await buffettIndicator();
    //console.log(siteServices);

    console.log("done");
})();
*/
