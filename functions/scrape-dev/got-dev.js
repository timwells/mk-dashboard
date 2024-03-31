const cheerio = require('cheerio');
const axios = require('axios')
const c = require('./common/c');

const GOT_URL_BLOGS = "https://www.gameoftrades.net/blog/"

async function GetFundList2(fundsDirectory) {
    let fundList = [];
    let totalFunds = 0;

    try {
        let { data } = await axios.get(fundsDirectory)
        const $ = cheerio.load(data)
        const listItems = $("#mainContent .list-unstyled li"); 
        totalFunds += listItems.length;
        console.log("GetFundList:",totalFunds,listItems.length,fundsDirectory);
        
        listItems.each((idx, el) => {
            const fund = {}
            fund.name = $(el).children("a").text();
            fund.link = $(el).children("a").attr("href");
            fundList.push(fund);
        })
    } catch (e) {
        console.log("ERROR GetFundList",e.message,fundsDirectory);
    }
    return fundList
}

async function GetBlogMaxPagintion($) {
    const blogPagination = $(".pagination > .page-numbers"); 
    let maxPages = 1
    blogPagination.each((idx, el) => {
        let pl = $(el).attr("href")
        if(pl === undefined) {
        } else {
            let result = pl.match( /\d+/g);
            if(result.length > 0){
                let n = parseInt(result[0])
                if(n > maxPages) maxPages = n;
            }
        }
    });
    return maxPages;
}

async function GetBlogItem(path) { 
    let { data } = await axios.get(path)
    const $ = await cheerio.load(data)
    const blogItems = $(".post_single > .left > a"); 

    blogItems.each((idx, el) => {
        let bItem = $(el).attr("href")
        console.log(bItem);
    });
}


async function GetBlogs(path) {
    let { data } = await axios.get(path)
    const $ = await cheerio.load(data)    
    const n = await GetBlogMaxPagintion($)
    
    for(let i = 2; i <= n;++i) {
        let { data } = await axios.get(path)
        const $ = await cheerio.load(data)
        let blogs = await GetBlogItem(`https://www.gameoftrades.net/blog/page/${i}/`)    

    }
}

async function listBlogs() {
    await GetBlogs(GOT_URL_BLOGS)
}

module.exports = {
    listBlogs,
}
