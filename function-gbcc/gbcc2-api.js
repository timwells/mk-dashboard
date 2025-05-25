const axios = require('axios')
const cheerio = require('cheerio');


const getGoldPriceImpls = async (id) => {
  try {
    // First
    let resource = `https://www.gbclassiccoins.co.uk/product-category/${id}/`;
    let _products = []
    do {
      let $ = await getResource(resource);
      let products = $('.products .col-inner')
      products.each(async (i,el) => {
        let title = $(el).find('.title-wrapper .product-title a').text();
        let titleSplit = title.split(",")
        let _name = ""
        let _scarcness = ""
        let _fineness = ""
        _name = titleSplit[0]
        if(titleSplit.length == 2) { _fineness = titleSplit[1].trim() }
        else if(titleSplit.length == 3) {
          _scarcness = (titleSplit[1].length > 0) ? titleSplit[1].trim() : ""
          _fineness = (titleSplit[2].length > 0) ? titleSplit[2].trim() : ""
        }
        else { // console.log(title,titleSplit.length)
        }

        // console.log($(el).find('.box-image .image-fade_in_back img').attr('data-lazy-src'))
        _products.push({
          id: id, 
          name: _name,
          scarcness: _scarcness,
          fineness: _fineness,
          price: +parseFloat($(el).find('.price-wrapper .price ins').text().split("£")[1]).toFixed(2),   // £175.00
          image: $(el).find('.box-image .image-fade_in_back img').attr('data-lazy-src')
        })
      })      
      resource = $('link[rel="next"]').attr('href')
    } while(resource != null)

    return _products;
  } catch(e) {
    console.log("getProductsImpls",e)
  }
  return null
}


const goldPrice = async (id) => {



module.exports = {
    goldPrices,
}
