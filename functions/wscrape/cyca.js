const axios = require('axios');
const cheerio = require('cheerio');
const { fromBuffer, fromPath } = require("pdf2pic");

const CC_HOST = "https://www.cypresscapital.com"
const CC_INDICATORS =  CC_HOST + "/charts/market-indicators/"

const CC_HEADERS = {
    'Accept-Encoding': 'gzip, compress, deflate, br',
    'Accept': '*/*',
    'Connection': 'keep-alive',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
    'Cache-Control' : 'no-cache',
}
async function downloadPdfToBuffer(pdfUrl, headers = {}) {
    try {
      const response = await axios({
        url: pdfUrl,
        method: 'GET',
        responseType: 'arraybuffer', // Ensures the response is treated as a binary buffer
        headers: headers             // Include the headers object
      });
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
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
    return res.status(200).json(indicators)
}

const testpdf2pic = async (req,res) => {
    console.log("-> testPdf2Pic")
    // return res.status(200).json({name:"testpdf2pic"});

    const pdfUrl = 'https://www.cypresscapital.com/wp-content/uploads/Research/Charts/AllArms.pdf?08-19-2022-11-28';
    const pdfUrl2 = "https://www.aeee.in/wp-content/uploads/2020/08/Sample-pdf.pdf"

    try {
        // Step 1: Download the PDF into a buffer
        const pdfBuffer = await downloadPdfToBuffer(pdfUrl2, CC_HEADERS);
    
        // Step 2: Convert the PDF buffer to images
        const options = {
          density: 100,           // output image density (quality)
          format: "png",          // output file format (png, jpeg, etc)
          width: 800,             // output image width
          height: 1000            // output image height
        };
    
        const convert = fromBuffer(pdfBuffer, options);
    
        // Convert all pages
        const pageToConvertAsImage = 1;
        const images = await convert(pageToConvertAsImage);
    
        // Step 3: Collect base64 strings for each page
        const base64Images = images.map(image => ({
          page: image.page,
          base64: image.base64
        }));
    
        // Step 4: Return the images as base64 strings in JSON response
        return res.status(200).json({ images: base64Images });
    
      } catch (err) {
        console.error('Conversion error:', err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
      }
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
    testpdf2pic
}