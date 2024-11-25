function monteCarloSimulation({
    initialPortfolio,         // Starting portfolio value
    annualWithdrawal,         // Initial annual withdrawal amount
    inflationRate,            // Annual inflation rate (e.g., 0.02 for 2%)
    expectedReturn,           // Expected annual return (e.g., 0.05 for 5%)
    returnStdDev,             // Standard deviation of returns (e.g., 0.1 for 10%)
    simulationYears,          // Number of years to simulate
    startYear,                // Start year
    numSimulations            // Number of Monte Carlo runs
  }) {
    const simulations = []; // Store all simulation results
  
    // Function to simulate a single scenario
    function runSimulation(simulationIndex) {
      let portfolio = initialPortfolio;
      let withdrawal = annualWithdrawal;
      const balances = [];
      let depletedYear = null;
  
      for (let year = 0; year < simulationYears; year++) {
        const randomReturn = expectedReturn + (Math.random() * returnStdDev * 2 - returnStdDev);
        portfolio *= (1 + randomReturn); // Apply random return
        withdrawal *= (1 + inflationRate); // Adjust withdrawal for inflation
        portfolio -= withdrawal; // Withdraw from portfolio
  
        // Record the year-end balance
        balances.push({
          time: (year + startYear).toString(), // Replace with custom starting year if needed
          value: +Math.max(portfolio, 0).toFixed(2) // Prevent negative balances
        });
  
        // Check if portfolio is depleted
        if (portfolio <= 0 && depletedYear === null) {
          depletedYear = year;
        }
      }
  
      return {
        balances,
        depleted: depletedYear !== null,
        depletedYear: depletedYear !== null ? (startYear + depletedYear).toString() : null,
        depletedShortfall: depletedYear !== null ? ((startYear + simulationYears) - (startYear + depletedYear)) : 0
      };
    }
  
    // Run multiple simulations
    for (let i = 0; i < numSimulations; i++) {
      simulations.push(runSimulation(i));
    }
  
    return simulations;
  }
  
  // Analyze results
function analyzeResults(simulations) {
    const endingBalances = simulations.map(sim => sim.balances[sim.balances.length - 1].value);
    const probabilityOfDepletion = (simulations.filter(sim => sim.depleted).length / simulations.length) * 100;

    // const maxShortFall = simulations.reduce((max, obj) => { return obj.depletedShortfall > max ? obj.depletedShortfall : max }, -Infinity);
    // const minShortFall = simulations.reduce((min, obj) => { return obj.depletedShortfall < min ? obj.depletedShortfall : min }, +Infinity);
    // const averageYearsLasted = runs.reduce((sum, r) => sum + r.yearsLasted, 0) / model.iterations;
  
    const percentiles = [5, 25, 50, 75, 95].map(p => ({
      percentile: p,
      value: endingBalances.sort((a, b) => a - b)[Math.floor((p / 100) * endingBalances.length)]
    }));
  
    return {
        probabilityOfDepletion,
        percentiles,

        // maxShortFall,
        // minShortFall,

        simulations
    };
}
  
const monteCarloModelImpl = async () => {
    const params = {
        initialPortfolio: 500000,   // £500,000 starting value
        annualWithdrawal: 30000,    // £30,000 initial withdrawal
        inflationRate: 0.025,       // 2.5% annual inflation
        expectedReturn: 0.05,       // 5% annual expected return
        returnStdDev: 0.1,          // 10% return standard deviation
        simulationYears: 30, 
        startYear: 2026,            // Simulate 30 years
        numSimulations: 20          // Run x scenarios
    };
    
    // Run the simulation
    const results = monteCarloSimulation(params);
    return analyzeResults(results);
}  

const monteCarloModelImpl2 = async (
    initialPortfolio,   
    annualWithdrawal,   
    inflationRate,     
    expectedReturn,     
    returnStdDev,       
    simulationYears, 
    startYear,          
    numSimulations
)  => {
    
    const params = {
        initialPortfolio: initialPortfolio,  // £500,000 starting value
        annualWithdrawal: annualWithdrawal,  // £30,000 initial withdrawal
        inflationRate: inflationRate,        // 2.5% annual inflation
        expectedReturn: expectedReturn,      // 5% annual expected return
        returnStdDev: returnStdDev,          // 10% return standard deviation
        simulationYears: simulationYears,    // Simulate 30 years
        startYear: startYear,                // 2026
        numSimulations: numSimulations       // Run x scenarios
    };
    
    // Run and analyse the simulation
    return analyzeResults(monteCarloSimulation(params));
}
module.exports = {
    monteCarloModelImpl,
    monteCarloModelImpl2,
}