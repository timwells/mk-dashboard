const hlApi = require('./hl/hl-api.js');
const CCM = require('./common/cache-mgt.js');
const val = require('./common/validation.js')

//const BUCKET_NAME = 'mk-d-b59f2.appspot.com';
const HL_FOLDER = 'hl-cache';
const HL_FUNDS_DATASET =  'funds.json';
// const HL_FUNDS_DATASET =  'funds.json';
const REQUEST_TIMEOUT = 80000

const test = async (req, res) => {
    let data = await hlApi.testImpl()
    return res.status(200).json(data)
}

const fundslist =  async (req, res) => {
    // const { exchange, symbol, period } = req.query
    //const datasetname = req.query.dataset;
    //const url = `${LTT_HOST}/${datasetname}`

    //const webResource = url
    const webResourceTimeout = REQUEST_TIMEOUT
    const cacheBucket = CCM.BUCKET_NAME
    const cacheResource = `${HL_FOLDER}/${HL_FUNDS_DATASET}` 
    const cacheAge = CCM.CACHE_AGE
    const cacheTag = "funds"
    const live = val.validateBoolParameter(req.query.live, ['true', 'false']) && req.query.live === 'true';
    //console.log("webResource:",webResource)
    
    console.log("webResourceTimeout:",webResourceTimeout)
    console.log("cacheBucket:",cacheBucket)
    console.log("cacheResource:",cacheResource)
    console.log("cacheAge:",cacheAge)
    console.log("cacheTag:",cacheTag)
    console.log("live:",live)

    try {
        const cacheResponse = await CCM.queryResourceStatus(cacheBucket,cacheResource);
        const hotRequest = (cacheResponse.expired || live)

        switch(cacheResponse.status) {
            case CCM.SUCCESS: {
                console.log("CCM.SUCCESS")
                if(!hotRequest) { // Get Resource from cache if not hotRequest
                    res.status(200).json(await CCM.getResource(cacheBucket,cacheResource,cacheTag))
                }
                else {
                    console.log("CCM.NOT_FOUND",cacheResource)
                    res.status(200).json(await CCM.updateResource(await hlApi.fundsListImpl(),cacheBucket,cacheResource,cacheAge,cacheTag,"re-cache"))                    
                }
            } break;
            case CCM.NOT_FOUND: {
                console.log("CCM.NOT_FOUND",cacheResource)
                res.status(200).json(await CCM.updateResource(await hlApi.fundsListImpl(),cacheBucket,cacheResource,cacheAge,cacheTag,"initialised-cache"))
            } break;
            default: {
                console.log("ERROR - ",cacheResponse.status)
                res.status(500).json({})
            }
        }    
    } catch(e) {
        console.log("fundslist",e)    
        res.status(500).json({})
    }
}

const fundspage =  async (req, res) => {
    const webResourceTimeout = REQUEST_TIMEOUT
    const cacheBucket = CCM.BUCKET_NAME
    const cacheAge = CCM.CACHE_AGE
    const live = val.validateBoolParameter(req.query.live, ['true', 'false']) && req.query.live === 'true';

    // destructure input
    const {start, rpp} = req.query

    const cacheResource = `${HL_FOLDER}/funds/funds-${start}.json`; 
    const cacheTag = `funds-${start}`

    console.log("webResourceTimeout:",webResourceTimeout)
    console.log("cacheBucket:",cacheBucket)
    console.log("cacheResource:",cacheResource)
    console.log("cacheAge:",cacheAge)
    console.log("cacheTag:",cacheTag)
    console.log("live:",live)

    try {
        const cacheResponse = await CCM.queryResourceStatus(cacheBucket,cacheResource);
        const hotRequest = (cacheResponse.expired || live)

        switch(cacheResponse.status) {
            case CCM.SUCCESS: {
                console.log("CCM.SUCCESS")
                if(!hotRequest) { // Get Resource from cache if not hotRequest
                    res.status(200).json(await CCM.getResource(cacheBucket,cacheResource,cacheTag))
                }
                else {
                    console.log("CCM.NOT_FOUND",cacheResource)
                    res.status(200).json(await CCM.updateResource(await hlApi.fundsPageImpl(start,rpp),cacheBucket,cacheResource,cacheAge,cacheTag,"re-cache"))                    
                }
            } break;
            case CCM.NOT_FOUND: {
                console.log("CCM.NOT_FOUND",cacheResource)
                res.status(200).json(await CCM.updateResource(await hlApi.fundsPageImpl(start,rpp),cacheBucket,cacheResource,cacheAge,cacheTag,"initialised-cache"))
            } break;
            default: {
                console.log("ERROR - ",cacheResponse.status)
                res.status(500).json({})
            }
        }    
    } catch(e) {
        console.log("fundspage",e)    
        res.status(500).json({})
    }
}
const fundscount =  async (req, res) => {
    let data = await hlApi.fundsCountImpl()
    return res.status(200).json(data)
}

module.exports = {
    test,
    fundslist,
    fundscount,
    fundspage
}

