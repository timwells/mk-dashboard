const cheerio = require('cheerio');
const axios = require('axios');

const FVZ_SITE_HOST = "https://finviz.com"
const FVZ_SITE_NEWS = FVZ_SITE_HOST + "/news.ashx"
const FVZ_SITE_INDUSTRY_FORWARD_PE = FVZ_SITE_HOST + "/groups.ashx?g=industry&v=410&o=-forwardpe"

/*
<img class="charts-gal" 
src="https://charts2-node.finviz.com/chart.ashx?cs=l&amp;t=industry_pharmaceuticalretailers&amp;tf=d&amp;s=percentage&amp;ct=line_chart&amp;in=group&amp;o[0][ot]=sma&amp;o[0][op]=50&amp;o[0][oc]=FF8F33C6" 
srcset="https://charts2-node.finviz.com/chart.ashx?cs=l&amp;t=industry_pharmaceuticalretailers&amp;tf=d&amp;s=percentage&amp;ct=line_chart&amp;in=group&amp;o[0][ot]=sma&amp;o[0][op]=50&amp;o[0][oc]=FF8F33C6 1x, https://charts2-node.finviz.com/chart.ashx?cs=l&amp;t=industry_pharmaceuticalretailers&amp;tf=d&amp;s=percentage&amp;ct=line_chart&amp;in=group&amp;o[0][ot]=sma&amp;o[0][op]=50&amp;o[0][oc]=FF8F33C6&amp;sf=2 2x" width="859" height="290" alt="" referrerpolicy="no-referrer-when-downgrade" loading="lazy">


FF8F33C6
FF8F33C6

<img class="charts-gal" 
    src="
https://charts2-node.finviz.com/chart.ashx?cs=l&amp;t=industry_pharmaceuticalretailers&amp;tf=d&amp;s=percentage&amp;ct=line_chart&amp;in=group&amp;o[0][ot]=sma&amp;o[0][op]=50&amp;o[0][oc]=FF8F33C6
    " srcset="https://charts2-node.finviz.com/chart.ashx?cs=l&amp;t=industry_pharmaceuticalretailers&amp;tf=d&amp;s=percentage&amp;ct=line_chart&amp;in=group&amp;o[0][ot]=sma&amp;o[0][op]=50&amp;o[0][oc]=FF8F33C6 1x, https://charts2-node.finviz.com/chart.ashx?cs=l&amp;t=industry_pharmaceuticalretailers&amp;tf=d&amp;s=percentage&amp;ct=line_chart&amp;in=group&amp;o[0][ot]=sma&amp;o[0][op]=50&amp;o[0][oc]=FF8F33C6&amp;sf=2 2x" width="859" height="290" alt="" referrerpolicy="no-referrer-when-downgrade" loading="lazy">

https://charts2-node.finviz.com/chart.ashx?cs=l&t=sector_basicmaterials&tf=d&s=percentage&ct=line_chart&tm=d&in=group&o[0][ot]=sma&o[0][op]=50&o[0][oc]=FF8F33C6

*/

const HEADERS = {
    'Accept-Encoding': 'gzip, compress, deflate, br',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Cache-Control' : 'max-age=0',
    'Accept-Language': 'en-GB,en;q=0.6',
}

async function fetchResource(
    url
) {
    const { data } = await axios.get(url, { headers: HEADERS});
    return data
}

async function getResource(
    url
) {
    try {
        return await fetchResource(url)
    } catch (err) {
        console.log(err.message)
    }
    return null
}

/*
<td class="news_link-cell" 
    data-boxover="cssbody=[news_tooltip-bdy] 
    cssheader=[news_tooltip-hdr] 
    body=[
        <table width=400>
            <tr>
                <td class='news_tooltip-tab'>There’s speculation the Trump campaign may also try to 
                    capitalize on the imagery: “That picture is going to be one for the century.”                
                </td>
            </tr>
        </table>] 
    delay=[100]">
    <a href="https://www.marketwatch.com/story/photos-of-bloodied-trump-after-rally-shooting-are-already-iconic-and-selling-on-t-shirts-e98a599d?mod=mw_rss_topstories" 
        target="_blank" 
        class="nn-tab-link" 
        rel="nofollow">Photos of bloodied Trump after rally shooting are already iconic — and selling on t-shirts
    </a>
</td>

<td class="news_link-cell" 
    data-boxover="cssbody=[news_tooltip-bdy] 
    cssheader=[news_tooltip-hdr] 
    body=[
        <table width=400>
            <tr>
                <td class='news_tooltip-tab'>Google Nears $23 Billion Deal for Cybersecurity Firm Wiz,&nbsp;WSJ Reports</td>
                </tr>
        </table>] 
    delay=[100]">
    <a href="https://www.bloomberg.com/news/articles/2024-07-14/google-nears-23-billion-deal-for-cybersecurity-firm-wiz-wsj" 
        target="_blank" class="nn-tab-link" 
        rel="nofollow">Google Nears $23 Billion Deal for Cybersecurity Firm Wiz,&nbsp;WSJ Reports</a>
</td>

<img class="charts-gal" src="https://charts2-node.finviz.com/chart.ashx?cs=l&amp;t=sector_communicationservices&amp;tf=d&amp;s=percentage&amp;ct=line_chart&amp;tm=d&amp;in=group&amp;o[0][ot]=sma&amp;o[0][op]=50&amp;o[0][oc]=FF8F33C6" srcset="https://charts2-node.finviz.com/chart.ashx?cs=l&amp;t=sector_communicationservices&amp;tf=d&amp;s=percentage&amp;ct=line_chart&amp;tm=d&amp;in=group&amp;o[0][ot]=sma&amp;o[0][op]=50&amp;o[0][oc]=FF8F33C6 1x, https://charts2-node.finviz.com/chart.ashx?cs=l&amp;t=sector_communicationservices&amp;tf=d&amp;s=percentage&amp;ct=line_chart&amp;tm=d&amp;in=group&amp;o[0][ot]=sma&amp;o[0][op]=50&amp;o[0][oc]=FF8F33C6&amp;sf=2 2x" width="859" height="290" alt="" referrerpolicy="no-referrer-when-downgrade" loading="lazy">
https://charts2-node.finviz.com/chart.ashx?cs=l&t=sector_basicmaterials&tf=d&s=percentage&ct=line_chart&tm=d&in=group&o[0][ot]=sma&o[0][op]=50&o[0][oc]=FF8F33C6
*/

async function processNews(url,timeout) {
    const htmlContent = await getResource(url);
    const $ = await cheerio.load(htmlContent);
    let rows = $('#news > div > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr')
    console.log(rows.length)
    let newsItems = []
    $(rows).each((i,row) => {
        let newsItem = {}
        let cols = $(row).find('td');
        $(cols).each((j,cont) => {
            switch(j) {
                //case 0:
                //    console.log(j,$(cont).text()); //$(e).text()
                //    break;
                case 1:
                    newsItem.datetime = $(cont).text()
                    break;
                case 2:
                    newsItem.headline = $(cont).text();
                    newsItem.href =  $(cont).find('a').attr("href")
                    break;
                }
        })
        newsItems.push(newsItem)
    })
    return newsItems
}

async function processGroupCharts(url,) {
    const htmlContent = await getResource(url);
    const $ = await cheerio.load(htmlContent);    
    const regex = /<b>(.*?)<\/b>/;
    let charts = [];
    let chartGrps = $("td > span")
    $(chartGrps).each((i,e) => {
        if(i>1) {
            const dbx = $(e).attr("data-boxover")
            const title = dbx.match(regex)[1];
            const src = $(e).find("img").attr("src").replace("=50","=100")
            let jObj = {}
            jObj.title = title
            jObj.img = src
            charts.push(jObj)
        }
    })
    return charts
}

const news = async (req, res) => {
    res.status(200).json(await processNews(FVZ_SITE_NEWS)) 
}

const industryforwardpe = async (req, res) => {
    res.status(200).json(await processGroupCharts(FVZ_SITE_INDUSTRY_FORWARD_PE))
}

const test = async (req, res) => {
    res.status(200).send("fviz.test")
}

module.exports = {
    test,
    news,
    industryforwardpe
}
