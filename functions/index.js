const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const express = require('express');
const cors = require('cors');
const app = express();

// const language = require('@google-cloud/language').v2;
// const language = require('@google-cloud/language');

const { config } = require("./config");

const VERSION = "1.0.44";
const API_KEY_NAME = "x-api-key"

const unauthorized = (res) => res.status(401).send('unauthorised');
const unprocessible = (res) => res.status(412).send('unprocessible');

const isApiKeyValid = (request,keyName,apiKeys) => {
    const apiKey = request.header(keyName);
    return (apiKey != undefined && apiKey != null && apiKey.length > 0) ? apiKeys.includes(apiKey) : false;
}

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(express.json());

app.get('/version', (request, response) => { response.send(VERSION) })

app.get('/v1/quote', async (request, response) => {
    if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {
        response.status(200).send("Hello from Firebase /quote!");
    } else unauthorized(response)
})

app.get('/v1/scrape/:site', (request, response) => {
    try {
        if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {
            const { scrapedata, scrapedata1 } = require(`./wscrape/${request.params.site}.js`)
            if(request.query.q != null) { scrapedata1(request,response) } 
            else { scrapedata(request,response) }
        } else unauthorized(response)
    } catch(e) { unprocessible(response) }
})

app.get('/v1/scrape/:site/:service', (request, response) => {
    try {
        if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {
            let site = request.params.site;
            let service = request.params.service;
            let siteServices = require(`./wscrape/${site}.js`)
            
            siteServices[service](request,response)    
        } else unauthorized(response)
    } catch(e) { unprocessible(response) }
})

app.post('/v1/dcf/:model', (request, response) => {
    try {
        if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {
            let model = request.params.model;
            let modelServices = require(`./dcf/dcf.js`)
            modelServices[model](request,response)
        } else unauthorized(response)
    } catch(e) {
        unprocessible(response)
    }
})


// https://console.developers.google.com/apis/api/language.googleapis.com/overview?project=mk-d-b59f2
/*
app.post('/v1/nlp/sentiment', async (request, response) => {    
    console.log("/v1/sentiment")
    try {
        if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {

            // Check if the request method is POST
            if (request.method !== 'POST') return response.status(405).send('Method Not Allowed');

            // Check if the request has a body
            if (!request.body) return response.status(400).send('Bad Request: No request body');
     
            // const text = "I like ice cream."
            // const text = 'No phone - unable to use mine because of rheumatoid arthritis'
            const text = request.body.message
            const client = new language.LanguageServiceClient();

            // Prepares a document, representing the provided text
            const document = {
                content: text,
                type: 'PLAIN_TEXT',
            };

            try {
                // Detects the sentiment of the text
                const [result] = await client.analyzeSentiment({ document });
                const sentiment = result.documentSentiment;
        
                // Send the result as the response
                return response.status(200).json({
                    score: sentiment.score,
                    magnitude: sentiment.magnitude,
                });
            } catch (error) {
                console.error('ERROR:', error);
                return response.status(500).send('Error analyzing sentiment');
            }
        } else unauthorized(response)
    } catch(e) {
        unprocessible(response)
    }
})
*/
/*
app.post('/v1/nlp/entities', async (request, response) => {    
    console.log("/v1/nlp/entities")
    try {
        if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {

            console.log("/v1/nlp/entities: isApiKeyValid OK")

            // Check if the request method is POST
            if (request.method !== 'POST') return response.status(405).send('Method Not Allowed');

            // Check if the request has a body
            if (!request.body) return response.status(400).send('Bad Request: No request body');
     
            const text = request.body.message

            const client = new language.LanguageServiceClient();

            // Prepares a document, representing the provided text
            const document = {
                content: text,
                type: 'PLAIN_TEXT',
            };

            try {
                // Detects the sentiment of the text
                const [result] = await client.analyzeEntities({ document });
                const entities = result.entities;

                // Send the result as the response
                return response.status(200).json(entities);

            } catch (error) {
                console.error('ERROR:', error);
                return response.status(500).send('Error analyzing sentiment');
            }
        } else unauthorized(response)
    } catch(e) {
        unprocessible(response)
    }
})
*/
// Entity Sentiment
/*
app.post('/v1/nlp/entity-sentiment', async (request, response) => {    
    console.log("/v1/nlp/entity-sentiment")
    try {
        if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {
            // Check if the request method is POST
            if (request.method !== 'POST') return response.status(405).send('Method Not Allowed');

            // Check if the request has a body
            if (!request.body) return response.status(400).send('Bad Request: No request body');
     
            // const text = "I like ice cream and donuts."
            //const text = 'No phone - unable to use mine because of rheumatoid arthritis';
            //const text = 'I am a James’s wife and James is unable to contact the GOP practice or complete his repeat prescriptions due to him previously having strokes, I usually fill his repeat prescriptions in and drop them off but it would be of great benefit if I was able to complete this online for him'
            
            const text = request.body.message
            const client = new language.LanguageServiceClient();

            // Prepares a document, representing the provided text
            const document = {
                content: text,
                type: 'PLAIN_TEXT',
            };

            try {
                // Detects the sentiment of the text
                const [result] = await client.analyzeEntitySentiment({ document });
                const entities = result.entities;

                console.log(entities)
        
                // Send the result as the response
                return response.status(200).json(entities);

            } catch (error) {
                console.error('ERROR:', error);
                return response.status(500).send('Error analyzing sentiment');
            }
        } else unauthorized(response)
    } catch(e) {
        unprocessible(response)
    }
})
*/

// classifyText
/*
app.post('/v1/nlp/classify', async (request, response) => {    
    console.log("/v1/nlp/classify")
    try {
        if(isApiKeyValid(request,API_KEY_NAME,config.apiKeys)) {
            // Check if the request method is POST
            if (request.method !== 'POST') return response.status(405).send('Method Not Allowed');

            // Check if the request has a body
            if (!request.body) return response.status(400).send('Bad Request: No request body');
     
            // const text = "I like ice cream and donuts."
            // const text = 'No phone - unable to use mine because of rheumatoid arthritis';
            // const text = 'I am a James’s wife and James is unable to contact the GOP practice or complete his repeat prescriptions due to him previously having strokes, I usually fill his repeat prescriptions in and drop them off but it would be of great benefit if I was able to complete this online for him'
            const text = request.body.message
            const client = new language.LanguageServiceClient();

            // Prepares a document, representing the provided text
            const document = { content: text, type: 'PLAIN_TEXT' };
            const classificationModelOptions = { v2Model: { contentCategoriesVersion: 'V2'}};
            
            try {
               // Classifies text in the document
                const [classification] = await client.classifyText({
                    document,
                    classificationModelOptions,
                });

                const categories = classification.categories;

                console.log(categories)
        
                // Send the result as the response
                return response.status(200).json(categories);

            } catch (error) {
                console.error('ERROR:', error);
                return response.status(500).send('Error analyzing sentiment');
            }
        } else unauthorized(response)
    } catch(e) {
        unprocessible(response)
    }
})
*/

// Expose Express API as a single Cloud Function:
// exports.fintech = functions.https.onRequest(app);
const gOpts = {memory: '4GB', timeoutSeconds: 120};
exports.fintech = functions.runWith(gOpts).https.onRequest(app);

const { scheduledFunction, jobadmin } = require("./jobs/job")

// Expose Express API as a single Cloud Function:
exports.jobadmin = jobadmin;

// Expose scheduled job
exports.scheduledFunction = scheduledFunction;