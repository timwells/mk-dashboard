
function monteCarloPensionDrawdown(model) {
    console.log(model)

    // Helper to generate random returns (normal distribution)
    const generateRandomReturn = () => {
        const u1 = Math.random();
        const u2 = Math.random();
        return (
            model.stdDev * Math.sqrt(-2 * Math.log(u1)) 
                * Math.cos(2 * Math.PI * u2) + model.meanReturn
        );
    };

    // Store results
    const results = [];
  
    // Run simulations
    for (let i = 0; i < model.iterations; i++) {
        let balance = model.initialPot;
        let yearsLasted = 0;
        let yearBalance = [];
        for (let year = 1; year <= model.years; year++) {
            const annualReturn = generateRandomReturn();
            balance = balance * (1 + annualReturn) - model.annualDrawdown;

            if (balance <= 0) {
                balance = 0;
                yearsLasted = year;
                break;
            }

            yearsLasted = year;
            yearBalance.push({ year: year, balance: +balance.toFixed(2) });
        }
        balance = +balance.toFixed(2)
        results.push({ balance, yearsLasted, yearBalance });
    }
  
    // Analyze results
    const probabilityOfDepletion = results.filter(r => r.balance === 0).length / model.iterations;
    const averageYearsLasted = results.reduce((sum, r) => sum + r.yearsLasted, 0) / model.iterations;
  
    return {
      results,
      probabilityOfDepletion: (probabilityOfDepletion * 100).toFixed(2) + '%',
      averageYearsLasted: averageYearsLasted.toFixed(1)
    };
}

/*
    60 + 30 = 90 years
    65 + 20 = 85 years
*/
const monteCarloModelImpl = async () => {
    const mc = monteCarloPensionDrawdown({
        initialPot: 1000000,    // Initial pension pot (£)
        annualDrawdown: 12000,  // Annual withdrawal (£)
        meanReturn: 0.04,       // Expected annual return (5%)
        stdDev: 0.1,            // Standard deviation of returns (10%)
        years: 30,              // Number of years to simulate
        iterations: 10          //10000 // Number of Monte Carlo simulations
    })
    
    return mc
}
const monteCarloModelImpl2 = async (
    initialPot,
    annualDrawdown,
    meanReturn,
    stdDev,
    years,
    iterations
) => {
    const mc = monteCarloPensionDrawdown({
            initialPot: initialPot,          // Initial pension pot (£)
            annualDrawdown: annualDrawdown,  // Annual withdrawal (£)
            meanReturn: meanReturn,          // Expected annual return (5%)
            stdDev: stdDev,                  // Standard deviation of returns (10%)
            years: years,                    // Number of years to simulate
            iterations: iterations           //10000 // Number of Monte Carlo simulations
    })
    return mc
}

module.exports = {
    monteCarloModelImpl,
    monteCarloModelImpl2
}