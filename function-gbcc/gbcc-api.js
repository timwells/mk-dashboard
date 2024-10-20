const axios = require('axios')
const cheerio = require('cheerio');

//const RVLT = require('./gbcc-constants.js')

const getLastPartOfUrl = (url) => {
  // Remove any trailing slashes from the URL
  const trimmedUrl = url.replace(/\/$/, '');
  // Split the URL by '/' and get the last part
  const parts = trimmedUrl.split('/');
  return parts[parts.length - 1];
}
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

// https://www.gbclassiccoins.co.uk/shop/
const getCategories = async () => {
  try {
    const $ = await getResource("https://www.gbclassiccoins.co.uk/shop/");
    const catItems = $('#shop-sidebar .cat-item a')
    let catItemDetails = []
    catItems.each((i,el) => {
      catItemDetails.push({
        name: $(el).text(), 
        href: $(el).attr('href'),
        category: getLastPartOfUrl($(el).attr('href'))
      })
    })
    return catItemDetails
  } catch(e) {

  }
  return null
}

const getProducts = async (id) => {
  try {
    const $ = await getResource(`https://www.gbclassiccoins.co.uk/product-category/${id}/`);
    const products = $('.products .col-inner')
    let _products = []
    products.each((i,el) => {
      _products.push({
        id: id, 
        name: $(el).find('.title-wrapper .product-title a').text(),
        price: $(el).find('.price-wrapper .price ins').text(),
        image: $(el).find('.box-image img').attr('src')
      })
    })
    return _products
  } catch(e) {
  }
  return null
}

module.exports = {
    getCategories,
    getProducts
}
