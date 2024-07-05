const axios = require('axios')
const cheerio = require('cheerio');

const TGE_COMMODITIES_HOST = "https://www.theglobaleconomy.com"
const TGE_COMMODITIES_LIST = TGE_COMMODITIES_HOST + "/world/"

// Define the groups and their corresponding commodities
const COMMODITY_MAP = {
    'Energy Commodities': [
      'brent_oil_prices',
      'wti_oil_prices',
      'dubai_oil_prices',
      'australian_coal_prices',
      'south_african_coal_prices',
      'natural_gas_usa',
      'natural_gas_europe',
      'natural_gas_japan_prices'
    ],
    'Beverage Commodities': [
      'cocoa_prices',
      'coffee_arabica_prices',
      'coffee_robusta_prices',
      'tea_prices_colombo',
      'tea_prices_kolkata',
      'tea_prices_mombada'
    ],
    'Oils and Oilseeds': [
      'coconut_oil_prices',
      'copra_prices',
      'groundnuts_prices',
      'groundnut_oil_prices',
      'palm_kernel_oil_prices',
      'soybeans_prices',
      'soybean_oil_prices',
      'soybean_meal',
      'sunflower_oil_prices',
      'rapeseed_oil_prices'
    ],
    'Grains and Cereals': [
      'barley_prices',
      'maize_prices',
      'thai_rice_prices',
      'vietnamese_rice_price',
      'wheat_price'
    ],
    'Fruits': [
      'banana_prices_eu',
      'banana_prices_us',
      'orange_prices'
    ],
    'Meat and Seafood': [
      'beef_prices',
      'chicken_meat_prices',
      'sheep_meat_prices',
      'shrimp_prices'
    ],
    'Sugar': [
      'sugar_prices_eu',
      'sugar_prices_usa'
    ],
    'Other Agricultural Products': [
      'tobacco_prices',
      'fish_meal_prices'
    ],
    'Forestry Commodities': [
      'logs_prices_camoroon',
      'logs_prices_malaysia',
      'sawnwood_prices_cameroon',
      'sawnwood_prices_malaysia',
      'plywood_prices'
    ],
    'Textile Commodities': [
      'cotton_prices',
      'rubber_prices'
    ],
    'Fertilizers': [
      'phosphate_rock_prices',
      'diammonium_phosphate_prices',
      'triple_superphosphate_prices',
      'urea_prices',
      'potassium_chloride_prices'
    ],
    'Base Metals': [
      'aluminum_prices',
      'iron_ore_prices',
      'copper_prices',
      'lead_prices',
      'tin_prices',
      'nickel_prices',
      'zinc_prices'
    ],
    'Precious Metals': [
      'gold_prices',
      'platinum_prices',
      'silver_prices'
    ]
  };
  
  // Function to create a lookup map for quick access
const createCommodityMap = (groups) => {
    const map = new Map();
    for (const [group, commodities] of Object.entries(groups)) {
      for (const commodity of commodities) {
        map.set(commodity, group);
      }
    }
    return map;
};
  
async function getContent(url) {
    try {
        const {data} = await axios.get(url)
        return await cheerio.load(data)
    } catch(e) {
        console.log("getContent",e.message)
    }
    return null
}

const commodities = async (req, res) => {
    const commodityMap = createCommodityMap(COMMODITY_MAP);
    const $ = await getContent(TGE_COMMODITIES_LIST)
    const indicators = $('#indicatorsList .indicatorRow')

    let commoditiesObjList = []

    /* 
    {
        group: "Textile Commodities",
        commodities: ["xx","yy","zz"]
    }
    */

    // if(!indicators) {
        indicators.each((i,row) => {
            let iObj = {}
            let indicatorName = $(row).find('.indicatorsName').text().trimStart().trimEnd()
            let indicatorHref = $(row).find('a').attr('href')
            let indicatorsMeasure = $(row).find('.indicatorsMeasure').text().trimStart().trimEnd()
            let indicatorsLastValue = $(row).find('.indicatorsLastValue').text().trimStart().trimEnd()
            let indicatorsCoverage = $(row).find('.indicatorsCoverage').text().trimStart().trimEnd()
            
            iObj.name = indicatorName
            iObj.href = indicatorHref
            iObj.measure = indicatorsMeasure
            iObj.lastValue = indicatorsLastValue
            iObj.period = indicatorsCoverage

            let indicatorHrefTokens = indicatorHref.split("/")
            let territory =  indicatorHrefTokens[1]
            let commodity =  indicatorHrefTokens[2]
            iObj.commodityGroup = commodityMap.get(commodity)

            iObj.chartUrl = `${TGE_COMMODITIES_HOST}/graph_country.php?p=400&m=1&c=${territory}&i=${commodity}`
            let index = 0
            if((index = commoditiesObjList.findIndex((e) => e.commodityGroup == iObj.commodityGroup)) == -1) {
                commoditiesObjList.push({commodityGroup: iObj.commodityGroup, commodities: [iObj]})
            } else { commoditiesObjList[index].commodities.push(iObj) }
        })
    //}
    // res.status(200).json({commodityGroups: commodityGroups, commodities: commoditiesList});
    res.status(200).json(commoditiesObjList);
}

const test = async (req, res) => {
    res.status(200).send("commodities");
}
module.exports = {
    test,
    commodities,
}
