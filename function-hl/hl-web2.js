const axios = require('axios');
const cheerio = require('cheerio');
const HL = require('./hl-constants.js')
const CCM = require('./common/cache/ccm.js');

const getResource = async (resource) => {
    try {
        const { data } = await axios.get(resource)
        return cheerio.load(data)
    }
    catch (err) {
        console.log(err)
    }
    return null
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
                    // Scope the selector to `col` (the current <td>)
                    bond.name = $(col).find('.link-headline').text().trim();
                    bond.href = $(col).find('.link-headline').attr('href');
                    bond.details = $(col).find('.text-reduce-1').text().trim();
                } break;
                case 1: bond.coupon = parseFloat(entity); break;
                case 2: 
                    bond.maturity = (new Date(entity)).toLocaleDateString("en-GB"); break;
                case 3: bond.price = parseFloat(entity); break;
            }
        });
        bond.nominal = 100.00;
        bond.diff = (bond.price - bond.nominal).toFixed(2);

        bonds.sort((a, b) => {
            const dateA = new Date(a.maturity.split('/').reverse().join('/'));
            const dateB = new Date(b.maturity.split('/').reverse().join('/'));
            return dateA - dateB;
        });        
        bonds.push(bond);
    })
    return bonds
}

async function bondList(group) {
    return await bondGroupListImpl(group)
}

module.exports = {
    bondList
}