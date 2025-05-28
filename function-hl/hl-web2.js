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
    const today = new Date();

    // Number of gilts purchased (rounded down)
    const nGilts = Math.floor(investment / bondPrice);

    // Nominal value is number of gilts times face value (£100 per gilt)
    const nominalValue = nGilts * 100;

    // Coupon payment frequency and amount
    const annualCoupon = nominalValue * couponRate;
    const semiAnnualCoupon = annualCoupon / 2;

    // Estimate number of semi-annual payments remaining
    const msPerDay = 1000 * 60 * 60 * 24;
    const maturityDate = new Date(maturityDateStr);
    const daysToMaturity = (maturityDate - today) / msPerDay;
    const couponInterval = 182.625; // ~6 months in days
    const numCoupons = Math.floor(daysToMaturity / couponInterval);

    // Total coupon income
    const totalCoupon = semiAnnualCoupon * numCoupons;

    // Capital gain/loss (difference between nominal and purchase price)
    const totalSpent = nGilts * bondPrice;
    const capitalGain = nominalValue - totalSpent;

    // Total return (coupons + capital gain/loss)
    const totalReturn = capitalGain + totalCoupon;

    // Time to maturity in years
    const yearsToMaturity = daysToMaturity / 365.25;

    // Simple annualised return
    const annualisedReturn = yearsToMaturity > 0
        ? (totalReturn / totalSpent) / yearsToMaturity * 100
        : 0;

    return {
        nominalValue: +nominalValue.toFixed(2),
        nGilts: +nGilts.toFixed(2),
        remainingCoupons: numCoupons,
        totalCoupon: +totalCoupon.toFixed(2),
        capitalGain: +capitalGain.toFixed(2), // This reflects the £5 gain if bought below £100
        totalReturn: +totalReturn.toFixed(2),
        annualisedReturn: +annualisedReturn.toFixed(2)
    };
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
            bond.nGilts = rtm.nGilts;
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