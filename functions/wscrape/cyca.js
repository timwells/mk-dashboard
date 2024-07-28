const axios = require('axios');
const cheerio = require('cheerio');

const CC_HOST = "https://www.cypresscapital.com"
const CC_INDICATORS =  CC_HOST + "/charts/market-indicators/"

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
/*
<tr id="table_2_row_0" role="row" class="odd">   
    <td style="" class="  column-indicator">
        <span class="responsiveExpander"></span>
        <a data-content="ARMS Index - All Exchanges" 
            href="https://www.cypresscapital.com/wp-content/uploads/Research/Charts/AllArms.pdf?08-19-2022-11-28" 
                target="_blank">ARMS Index - All Exchanges</a>
    </td>
    <td style="" class="  column-category">Breadth</td>
    <td style="" class="  column-group">All Exchanges</td>
</tr>
*/

const indicators = async (req, res) => {
    console.log("cypresscapital - indicators")
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
    res.status(200).json(indicators)
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
    indicators
}