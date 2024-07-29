const axios = require('axios');
const cheerio = require('cheerio');

const CC_HOST = "https://www.cypresscapital.com"
const CC_INDICATORS =  CC_HOST + "/charts/market-indicators/"
const CC_NEWS =  CC_HOST + "/research/"

const CC_HEADERS = {
    'Accept-Encoding': 'gzip, compress, deflate, br',
    'Accept': '*/*',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'Cache-Control' : 'no-cache',
}

async function fetchResource(
    url
) {
    try {
        // const { data } = await axios.get(url, { headers: HEADERS});
        const { data } = await axios.get(url);
        return data
    } catch (e) {
        console.error(e)
    }
    return null
}

// https://d3fy651gv2fhd3.cloudfront.net/charts/calendar-354569.png?h=20&w=40&n=4&y=0&y2=0&x=0&title=false&lbl=0&bg=0&v=V20230410&url=/france/business-confidence;
const indicators = async (req, res) => {
    const htmlContent = await fetchResource(CC_INDICATORS);
    const $ = await cheerio.load(htmlContent);
    let indicators = [];
    let rows = $('#table_1> tbody > tr')
    
    $(rows).each((i,row) => {
        let indicator = {}
        let cols = $(row).find('td');
        $(cols).each((j,content) => {
            switch(j) {
                case 1: 
                    indicator.title = $(content).text();
                    indicator.href = $(content).find('a').attr("href");
                break;
                case 2: 
                    indicator.category = $(content).text();
                    break;
                case 3: 
                    indicator.group = $(content).text()
                    break;
            }
        })
        indicators.push(indicator)
    })
    return res.status(200).json(indicators)
}

const news = async (req, res) => {
    const htmlContent = await fetchResource(CC_NEWS);
    const $ = await cheerio.load(htmlContent);
    let news = [];
    let rows = $('article h2')
    $(rows).each((i,row) => {
        let item = {}
        let href = $(row).find('a').attr("href");
        if(href != undefined) {
            item.href = CC_HOST + $(row).find('a').attr("href").replace("#new_tab","")
            item.title = $(row).find('a').text()
            news.push(item)
        }        
    })
    return res.status(200).json(news)
}

const test = async (req, res) => {
    console.log("cypresscapital - test") 
    try {
        return res.status(200).send("OK")
    }catch(e) {
        console.log(e.message)
    }
    return res.status(500).send("error")
}

module.exports = {
    test,
    indicators,
    news
}