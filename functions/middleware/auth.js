// Replace this with your actual API key or load from environment variables
const VALID_API_KEY = 'cdb0f522-ed34-4374-9ba3-5c2c6eabba3f'; 

const apiKeyCheck = (req, res, next) => {
    const apiKey = req.headers['api-key']; // Access the api-key from headers

    if (!apiKey) {
        return res.status(401).json({ error: 'API key is missing' });
    }

    if (apiKey !== VALID_API_KEY) {
        return res.status(403).json({ error: 'Invalid API key' });
    }

    // If API key is valid, proceed to the next middleware or route handler
    next();
};

module.exports = apiKeyCheck;