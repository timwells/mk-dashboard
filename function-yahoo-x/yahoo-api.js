
const yf2 = require('yahoo-finance2').default;
const { parseExpression, evaluateExpressionOnArrays } = require('./expressionParser.js');

const getHistoricalValuesImpl = async (expression, period1, period2, interval) => {
    if (!expression || !period1 || !period2 || !interval) {
        return { expression, data: [] };
    }

    try {
        // Step 1: Parse the expression into tokens (with parentheses support)
        const parsedTokens = parseExpression(expression);

        // Step 2: Extract unique stock symbols
        const operatorSet = new Set(['+', '*', '/', '(', ')']); // '-' is NOT treated as operator
        const symbols = [...new Set(
            parsedTokens.filter(t => 
                typeof t === 'string' && 
                !operatorSet.has(t) && 
                isNaN(t)
            )
        )];

        if (symbols.length === 0) {
            throw new Error("No valid symbols found in expression.");
        }

        // Step 3: Fetch historical data for each symbol
        const dataSources = {};
        for (const symbol of symbols) {
            const history = await yf2.historical(symbol, { period1, period2, interval });
            dataSources[symbol] = history.map(el => ({
                time: el.date.toISOString().slice(0, 10), // YYYY-MM-DD
                value: +el.close
            }));
        }

        // Step 4: Evaluate the parsed expression over matching timestamps
        const evaluatedData = evaluateExpressionOnArrays(parsedTokens, dataSources);

        return { expression, data: evaluatedData };

    } catch (error) {
        const szError = `Failed to fetch or evaluate history for expression "${expression}":`;
        console.error(szError, error);
        return { expression, data: [], error: szError + ' ' + (error.message || error) };
    }
};

module.exports = {
    getHistoricalValuesImpl,
}
