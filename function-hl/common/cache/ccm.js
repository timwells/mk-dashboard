// Cahch Manager
const { Storage } = require('@google-cloud/storage');
const { Readable } = require('stream');

const BUCKET_NAME = 'mk-d-b59f2.appspot.com';
const CACHE_AGE =  43200
const CACHE_AGE_1YEAR =  365*24*60 *60
const SUCCESS = 200
const NOT_FOUND = 404
const ERROR = 500

async function _uploadJsonStream(
    writeStream, 
    dataObj
) {
    return new Promise((resolve, reject) => {
        const jsonString = JSON.stringify(dataObj);
        const jsonStream = new Readable();

        jsonStream.push(jsonString);
        jsonStream.push(null); // No more data

        jsonStream.pipe(writeStream)
            .on('finish', () => { resolve(dataObj);})
            .on('error', (error) => { reject(error);});
    });
}

function _isExpired(
    metadata
) {
    try {
        // Extract the cacheControl metadata
        const cacheControl = metadata.cacheControl;
  
        if (!cacheControl) return false;  // No cacheControl metadata found

        // Parse max-age value from cacheControl
        const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
        if (!maxAgeMatch) return false; // No max-age directive found in cacheControl
  
        const maxAgeSeconds = parseInt(maxAgeMatch[1], 10);
  
        // Get the time when the file was last updated
        const updatedTime = new Date(metadata.updated);
        const currentTime = new Date();
  
        // Calculate the age of the cached content in seconds & if the cache has expired
        return ((currentTime - updatedTime) / 1000) > maxAgeSeconds;  
  
    } catch (error) {
        console.error('Error checking cache expiration:', error);
        return false;
    }
}

async function queryResourceStatus(
    bucket,
    resource
) {
    const storage = new Storage();
    const file = storage.bucket(bucket).file(resource);    
    let resp = { status: SUCCESS, metadata : null }
    try {
        resp.expired = true  
        const [metadata] = await file.getMetadata()
        if(!_isExpired(metadata)) { resp.expired = false }
        resp.metadata = metadata
    } catch(e) {
        resp.status = e.code
    }
    return resp
}

async function getResource(
    bucket,
    resource,
    tag, 
) {
    const storage = new Storage();
    const file = storage.bucket(bucket).file(resource);
    try {
        const [metadata] = await file.getMetadata()
        const [contents] = await file.download();
        return { status: SUCCESS, created: metadata.timeCreated, tag:tag, source: "cache", data: JSON.parse(contents.toString())}
    } catch(e) {
        return { status: ERROR, tag:tag, data: null }
    }
}

async function fetchFormattedResource(
    fetchCallback,
    resource,
    formatCallback,
) {
    return await formatCallback(await fetchCallback(resource))
}

async function updateResource(
    content,
    cacheBucket,
    cacheResource,
    cacheAge,
    cacheTag,
    source
) {        
    try {
        const storage = new Storage();
        const file = storage.bucket(cacheBucket).file(cacheResource);
        const wStream = file.createWriteStream({ 
            metadata: { contentType: 'application/json', cacheControl: `public,max-age=${cacheAge}`} 
        });
        
        return { 
            status: SUCCESS, 
            tag:cacheTag, 
            created: new Date().toISOString(), 
            source: source,
            data: await _uploadJsonStream(wStream,content) 
        }
     } catch(e) {
        console.log("updateResource",e)
    }
    return { status: ERROR, tag:cacheTag, created: null, data: null}
}

const listObjects = async (bucketName,folder) => {
    const storage = new Storage();
    const options = {prefix: folder } // Only list files in this folder
    try {
        // Get a list of objects in the bucket
        const [files] = await storage.bucket(bucketName).getFiles(options);
        return files.map(o => ({ 
            name:o.name, created: 
            o.metadata.timeCreated, 
            cacheControl: o.metadata.cacheControl
        }))
    } catch (error) {
        console.error('Error listing objects:', error);
    }
    return []
}

module.exports = {
    BUCKET_NAME,
    CACHE_AGE,
    CACHE_AGE_1YEAR,
    SUCCESS,
    NOT_FOUND,
    queryResourceStatus,
    getResource,
    updateResource,
    fetchFormattedResource,
    listObjects
}