const axios = require('axios')
const cheerio = require('cheerio');
const CCM = require('./common/cache/ccm.js');
const GBCC = require('./gbcc-constants.js')

const getLastPartOfUrl = (url) => {
  const trimmedUrl = url.replace(/\/$/, '');
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
const getCategoriesImpls = async () => {
  try {
    const $ = await getResource("https://www.gbclassiccoins.co.uk/shop/");
    const catItems = $('#shop-sidebar .cat-item a')
    let catItemDetails = []
    catItems.each((i,el) => {
      catItemDetails.push({
        name: $(el).text(), 
        // href: $(el).attr('href'),
        category: getLastPartOfUrl($(el).attr('href'))
      })
    })
    return catItemDetails
  } catch(e) {
    console.log("getCategoriesImpls")
  }
  return null
}

const getCategories = async () => {
  const cacheBucket = CCM.BUCKET_NAME
  const cacheAge = CCM.CACHE_AGE_1WEEK
  const live = false
  const cacheResource = `${GBCC.GBCC_CACHE_CATEGORIES}/categories.json`; 
  const cacheTag = `categories`

  try {
      const cacheResponse = await CCM.queryResourceStatus(cacheBucket,cacheResource);
      const hotRequest = (cacheResponse.expired || live)

      switch(cacheResponse.status) {
          case CCM.SUCCESS: {
              console.log("CCM.SUCCESS")
              if(!hotRequest) { // Get Resource from cache if not hotRequest
                  return await CCM.getResource(cacheBucket,cacheResource,cacheTag)
              }
              else {
                  console.log("CCM.NOT_FOUND",cacheResource)
                  return (await CCM.updateResource(await getCategoriesImpls(),cacheBucket,cacheResource,cacheAge,cacheTag,"re-cache"))                    
              }
          }
          case CCM.NOT_FOUND: { 
              console.log("CCM.NOT_FOUND",cacheResource)
              return (await CCM.updateResource(await getCategoriesImpls(),cacheBucket,cacheResource,cacheAge,cacheTag,"initialised-cache"))
          }
          default: {
              console.log("ERROR - ",cacheResponse.status)
          }
      }    
  } catch(e) {
      console.log("getCategories",e)    
  }
  return null

}

const getProductsImpls = async (id) => {
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
    console.log("getProductsImpls")
  }
  return null
}

const getProducts = async (id) => {
  const cacheBucket = CCM.BUCKET_NAME
  const cacheAge = CCM.CACHE_AGE_1WEEK
  const live = false
  const cacheResource = `${GBCC.GBCC_CACHE_PRODUCTS}/${id}.json`; 
  const cacheTag = `products-${id}`

  try {
      const cacheResponse = await CCM.queryResourceStatus(cacheBucket,cacheResource);
      const hotRequest = (cacheResponse.expired || live)

      switch(cacheResponse.status) {
          case CCM.SUCCESS: {
              console.log("CCM.SUCCESS")
              if(!hotRequest) { // Get Resource from cache if not hotRequest
                  return await CCM.getResource(cacheBucket,cacheResource,cacheTag)
              }
              else {
                  console.log("CCM.NOT_FOUND",cacheResource)
                  return (await CCM.updateResource(await getProductsImpls(id),cacheBucket,cacheResource,cacheAge,cacheTag,"re-cache"))                    
              }
          }
          case CCM.NOT_FOUND: { 
              console.log("CCM.NOT_FOUND",cacheResource)
              return (await CCM.updateResource(await getProductsImpls(id),cacheBucket,cacheResource,cacheAge,cacheTag,"initialised-cache"))
          }
          default: {
              console.log("ERROR - ",cacheResponse.status)
          }
      }    
  } catch(e) {
      console.log("getProducts",e)    
  }
  return null

}


module.exports = {
    getCategories,
    getProducts
}
