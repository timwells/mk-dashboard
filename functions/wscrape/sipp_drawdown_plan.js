const modelVariables = {
  initialPensionPot: 1073000,
  taxFreeLumpSum: 268275,
  growthRate: 0.04,
  inflationRate: 0.02,
  statePensionGrowth: 0.025,
  personalAllowance: 12570,
  higherRateThreshold: 51276, // £50,270 * (1+0.02)^2 for 2027
  netIncomeTarget: 30000, // 2027 prices
  taxRate: 0.2,
  giftRate: 0.1,
  startYear: 2027,
  startAge: 62,
  endAge: 88,
  statePensionStartYear: 2032,
  statePensionBase: 12104 // £11,502.40 * (1+0.025)^7 for 2032
};

function calculateDrawdownPlan() {
  const plan = [];
  let pensionPot = modelVariables.initialPensionPot;
  
  // First year: include tax-free lump sum
  let yearData = {
    year: modelVariables.startYear,
    age: modelVariables.startAge,
    pensionPotStart: pensionPot,
    withdrawal: modelVariables.taxFreeLumpSum + 42520, // LSA + taxable drawdown
    tax: 42520 * modelVariables.taxRate,
    gift: 42520 * modelVariables.giftRate,
    statePension: 0,
    taxableIncome: 42520,
    netIncomeAfterTaxAndGift: (42520 * (1 - modelVariables.taxRate)) - (42520 * modelVariables.giftRate),
    pensionPotGrowth: ((pensionPot - modelVariables.taxFreeLumpSum - 42520) * modelVariables.growthRate),
    pensionPotEnd: pensionPot - modelVariables.taxFreeLumpSum - 42520 + ((pensionPot - modelVariables.taxFreeLumpSum - 42520) * modelVariables.growthRate)
  };
  plan.push(yearData);
  pensionPot = yearData.pensionPotEnd;

  // Years 2028–2053
  for (let year = modelVariables.startYear + 1, age = modelVariables.startAge + 1; age <= modelVariables.endAge; year++, age++) {
    // Calculate state pension
    const statePension = year >= modelVariables.statePensionStartYear 
      ? modelVariables.statePensionBase * Math.pow(1 + modelVariables.statePensionGrowth, year - modelVariables.statePensionStartYear)
      : 0;

    // Calculate withdrawal to stay below higher-rate threshold
    const withdrawal = year < modelVariables.statePensionStartYear 
      ? 42520 
      : Math.min(42520 - statePension, modelVariables.higherRateThreshold - statePension);
    
    const tax = withdrawal * modelVariables.taxRate;
    const gift = withdrawal * modelVariables.giftRate;
    const taxableIncome = withdrawal + statePension;
    const netIncome = (withdrawal * (1 - modelVariables.taxRate)) - gift + statePension;
    const potGrowth = (pensionPot - withdrawal) * modelVariables.growthRate;
    const pensionPotEnd = pensionPot - withdrawal + potGrowth;

    plan.push({
      year,
      age,
      pensionPotStart: pensionPot,
      withdrawal,
      tax,
      gift,
      statePension,
      taxableIncome,
      netIncomeAfterTaxAndGift: netIncome,
      pensionPotGrowth: potGrowth,
      pensionPotEnd
    });

    pensionPot = pensionPotEnd;
  }

  return {
    modelVariables,
    drawdownPlan: plan
  };
}

// Generate and output JSON
const result = calculateDrawdownPlan();
console.log(JSON.stringify(result, null, 2));