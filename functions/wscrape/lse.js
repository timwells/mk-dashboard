const cheerio = require('cheerio');
const cModule = require('./common/c.js');

console.log(cModule)
const LSE_SECTOR_HOST = "https://www.lse.co.uk"
const LSE_SECTOR_PERFORMANCE = LSE_SECTOR_HOST + "/share-prices/sectors/"
const USER_AGENT = "'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"

const processRequest = async (url,timeout) => {
    const _pInstance = await cModule.getPuppetInstance();
    const page = await _pInstance.newPage()
    await page.setUserAgent(USER_AGENT)
    await page.goto(url, {timeout: timeout, waitUntil: 'domcontentloaded'});
    const htmlContent = await page.content();
    return cheerio.load(htmlContent);
}

/*
<tr class="down">
    <td><a href="https://www.lse.co.uk/share-prices/sectors/aerospace/" 
        title="Aerospace Sector Value">Aerospace</a></td>
    <td class="hidden-xs">11,345.84</td>
    <td class="hidden-tiny">-162.82</td>
    <td>-1.41%</td>
</tr>
*/
const sectorpeformance = async (req, res) => {
    const $ = await processRequest(LSE_SECTOR_PERFORMANCE,60000)
    const tableRows = $('.sp-sectors__table > tbody > tr');
    let sectorPerformanceList = []
    $(tableRows).each((i,row) => {
        let sectorPeformance = {}
        $(row).find('td').each((j,e) => {     
            switch(j) {
                case 0: {
                    sectorPeformance.name = $(e).find('a').text()
                    sectorPeformance.href = $(e).find('a').attr('href')
                } break;
                case 1: {
                    sectorPeformance.changeValue = $(e).text()
                } break;
                case 2: {
                    sectorPeformance.changePercent = $(e).text()
                } break;
            }
        })
        if(i>0)
            sectorPerformanceList.push(sectorPeformance)
    })

    res.status(200).json(sectorPerformanceList)
}

const sectorpeformance2 = async (req, res) => {
    console.log("sectorpeformance2")
    res.status(200).json({hello:"sectorpeformance2"})
}

module.exports = {
    sectorpeformance,
    sectorpeformance2
}
