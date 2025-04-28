// expressionParser.js

// ----------------
// Parse the expression string into tokens
function parseExpression(expression) {
    const tokens = [];
    let buffer = '';

    for (let i = 0; i < expression.length; i++) {
        const c = expression[i];

        if ('()+-*/'.includes(c)) {
            if (buffer.trim()) {
                tokens.push(buffer.trim());
                buffer = '';
            }
            tokens.push(c);
        } else {
            buffer += c;
        }
    }

    if (buffer.trim()) {
        tokens.push(buffer.trim());
    }

    return tokens;
}

// ----------------
// Evaluate the parsed expression tokens on arrays
function evaluateExpressionOnArrays(tokens, datasets) {
    // First, find common timestamps
    const dateSets = Object.values(datasets).map(ds => new Set(ds.map(d => d.time)));
    const commonDates = dateSets.reduce((acc, dates) => {
        return new Set([...acc].filter(date => dates.has(date)));
    });

    const commonDatesArray = Array.from(commonDates).sort(); // Sort ascending

    // Build a map: symbol -> {time -> value}
    const symbolTimeValueMap = {};
    for (const [symbol, records] of Object.entries(datasets)) {
        symbolTimeValueMap[symbol] = {};
        for (const rec of records) {
            symbolTimeValueMap[symbol][rec.time] = rec.value;
        }
    }

    // For each common date, evaluate expression
    const output = [];

    for (const date of commonDatesArray) {
        // Replace symbols with actual values for that date
        const evaluatedTokens = tokens.map(token => {
            if (['+', '-', '*', '/', '(', ')'].includes(token)) {
                return token;
            } else if (!isNaN(token)) {
                return parseFloat(token);
            } else if (symbolTimeValueMap[token] && symbolTimeValueMap[token][date] !== undefined) {
                return symbolTimeValueMap[token][date];
            } else {
                // Missing data for this symbol at this date
                return NaN;
            }
        });

        // Join evaluatedTokens into a real JS expression
        const exprString = evaluatedTokens.join(' ');

        let value;
        try {
            value = eval(exprString);
        } catch (e) {
            console.error(`Failed to evaluate expression '${exprString}' on date ${date}`, e);
            value = NaN;
        }

        if (!isNaN(value)) {
            output.push({ time: date, value });
        }
    }

    return output;
}

// ----------------
// Export for require() usage
module.exports = {
    parseExpression,
    evaluateExpressionOnArrays
};
