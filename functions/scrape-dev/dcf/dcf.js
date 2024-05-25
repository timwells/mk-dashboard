// DCF fro I3E stock

const calculateDCF = async () => {
  /*
  const discountRate = parseFloat(await askQuestion('Enter the discount rate (e.g., 0.15 for 15%): '));
  const growthRate = parseFloat(await askQuestion('Enter the growth rate (e.g., 0.05 for 5%): '));
  const terminalGrowthRate = parseFloat(await askQuestion('Enter the terminal growth rate (e.g., 0.02 for 2%): '));
  const sharesOutstanding = parseFloat(await askQuestion('Enter the number of shares outstanding (e.g., 1.2e9 for 1.2 billion): '));
  const netDebt = parseFloat(await askQuestion('Enter the net debt (e.g., 0 for no debt): '));
  const fcf = parseFloat(await askQuestion('Enter the Free Cash Flow (FCF) for the last year (e.g., 28.841 for £28.841 million): '));
*/
  const discountRate = 0.15
  const growthRate = 0.05
  const terminalGrowthRate = 0.02
  const sharesOutstanding = 1200000000 //1.2e9  Billion
  const netDebt = 0
  const fcf = 28841000 //28.841M

  const projectedFCFs = [];
  for (let i = 1; i <= 5; i++) {
    const projectedFCF = fcf * Math.pow(1 + growthRate, i);
    projectedFCFs.push(projectedFCF);
  }
  console.log(projectedFCFs)

  const terminalValue = projectedFCFs[4] * (1 + terminalGrowthRate) / (discountRate - terminalGrowthRate);
  console.log(terminalValue)

  const discountedFCFs = projectedFCFs.map((fcf, i) => fcf / Math.pow(1 + discountRate, i + 1));
  console.log(discountedFCFs)

  const discountedTerminalValue = terminalValue / Math.pow(1 + discountRate, 5);
  console.log(discountedTerminalValue)
  
  const enterpriseValue = discountedFCFs.reduce((acc, val) => acc + val, 0) + discountedTerminalValue;
  console.log(enterpriseValue)

  const equityValue = enterpriseValue - netDebt;
  console.log(equityValue)

  const intrinsicValuePerShare = equityValue / sharesOutstanding;
  console.log(intrinsicValuePerShare)

  console.log(`Intrinsic Value per Share: £${intrinsicValuePerShare.toFixed(3)}`);
};

calculateDCF();
