const axios = require('axios');
const cheerio = require('cheerio');
const HL = require('./hl-constants.js')
const CCM = require('./common/cache/ccm.js');

const getResource = async (resource) => {
    try {
        const { data } = await axios.get(resource)
        return cheerio.load(data)
    }
    catch (err) { console.log(err);}
    return null
}

function returnsToMaturity (
    investment,
    bondPrice,
    couponRate,
    maturityDateStr
) {
    //console.debug('[returnsToMaturity] called with:', {
    //    investment,
    //    bondPrice,
    //    couponRate,
    //    maturityDateStr
    //});

    const today = new Date();

    // Nominal purchased
    const nominalValue = (investment / bondPrice) * 100;
    //console.debug('[returnsToMaturity] nominalValue:', nominalValue);

    // Coupon payment frequency and amount
    const annualCoupon = nominalValue * couponRate;
    const semiAnnualCoupon = annualCoupon / 2;
    //console.debug('[returnsToMaturity] annualCoupon:', annualCoupon, 'semiAnnualCoupon:', semiAnnualCoupon);

    // Estimate number of semi-annual payments remaining
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysToMaturity =  (new Date(maturityDateStr) - today) / msPerDay;
    const couponInterval = 182.625; // ~6 months in days
    const numCoupons = Math.floor(daysToMaturity / couponInterval);
    //console.debug('[returnsToMaturity] maturityDateStr:',maturityDateStr,'daysToMaturity:', daysToMaturity, 'numCoupons:', numCoupons);

    // Total coupon income
    const totalCoupon = semiAnnualCoupon * numCoupons;
    //console.debug('[returnsToMaturity] totalCoupon:', totalCoupon);

    // Capital gain/loss (assuming redeemed at £100 nominal)
    const capitalGain = nominalValue - investment;
    //console.debug('[returnsToMaturity] capitalGain:', capitalGain);

    // Total return
    const totalReturn = capitalGain + totalCoupon;
    //console.debug('[returnsToMaturity] totalReturn:', totalReturn);

    // Time to maturity in years
    const yearsToMaturity = daysToMaturity / 365.25;
    //console.debug('[returnsToMaturity] yearsToMaturity:', yearsToMaturity);

    // Simple annualised return
    const annualisedReturn = (totalReturn / investment) / yearsToMaturity * 100;
    //console.debug('[returnsToMaturity] annualisedReturn:', annualisedReturn);

    //console.log(`Nominal purchased: £${nominalValue.toFixed(2)}`);
    //console.log(`Number of remaining coupon payments: ${numCoupons}`);
    //console.log(`Total coupon income: £${totalCoupon.toFixed(2)}`);
    //console.log(`Capital gain at maturity: £${capitalGain.toFixed(2)}`);
    //console.log(`Total return to maturity: £${totalReturn.toFixed(2)}`);
    //console.log(`Estimated annualised return: ${annualisedReturn.toFixed(2)}%`);

    return {
        nominalValue : +nominalValue.toFixed(2),
        remainingCoupons: numCoupons,
        totalCoupon: +totalCoupon.toFixed(2),
        capitalGain: +capitalGain.toFixed(2),
        totalReturn: +totalReturn.toFixed(2),
        annualisedReturn: +annualisedReturn.toFixed(2)
    }
}


// https://www.hl.co.uk/shares/corporate-bonds-gilts/bond-prices/uk-gilts
async function bondGroupListImpl(group) {
    const resource = `https://www.hl.co.uk/shares/corporate-bonds-gilts/bond-prices/${group}`
    console.log(resource)
    const $ = await getResource(resource)
/*
<td class="align-left">
 <a href="https://www.hl.co.uk/shares/shares-search-results/BL68HJ2" 
    title="View factsheet for Treasury 0.125% 30/01/2026" 
        class="link-headline">Treasury 0.125% 30/01/2026</a><br>
    <span class="text-reduce-1">GBP | GB00BL68HJ26 | BL68HJ2</span>
</td>
*/
    let bonds = []
    $('#mainContent table tbody').find('tr').each((i, row) => {
        let colsD = $(row).find('td');
        let bond = {}        
        colsD.each((j, col) => {
            let entity = $(col).text().replace(/[\n|\t]/gm, '')
            switch(j) {
                case 0: {
                    bond.name = $(col).find('.link-headline').text().trim();
                    bond.href = $(col).find('.link-headline').attr('href');
                    bond.details = $(col).find('.text-reduce-1').text().trim();
                } break;
                case 1: 
                    bond.coupon = +(parseFloat(entity) || 0.0).toFixed(2); 
                    break;
                case 2: {
                    bond.maturity = (new Date(entity)).toLocaleDateString("en-GB"); 
                    const dateNow = new Date();
                    const maturityDate = new Date(entity);
                    bond.daysRemaining = +((maturityDate - dateNow) / (1000 * 60 * 60 * 24)).toFixed(2);
                }
                break;                
                case 3: 
                    bond.price = +(parseFloat(entity) || 0.0).toFixed(2); 
                    break;
            }
            bond.nominal = 100.00;
            bond.diff = +(bond.price - bond.nominal).toFixed(2);
            const rtm = returnsToMaturity(5000,bond.price,bond.coupon/100,bond.maturity)
            bond.nominalValue = rtm.nominalValue;
            bond.remainingCoupons = rtm.remainingCoupons;
            bond.totalCoupon = rtm.totalCoupon;
            bond.capitalGain = rtm.capitalGain
            bond.totalReturn = rtm.totalReturn
            bond.annualisedReturn = rtm.annualisedReturn
        });
        bonds.push(bond);
    });
    bonds.sort((a, b) => {
        const dateA = new Date(a.maturity.split('/').reverse().join('/'));
        const dateB = new Date(b.maturity.split('/').reverse().join('/'));
        return dateA - dateB;
    });        
 
    return bonds
}

async function bondList(group) {
    return await bondGroupListImpl(group)
}

module.exports = {
    bondList
}