// const cheerio = require('cheerio');
const cModule = require('./common/c')

async function finOpsQuestionsRequest(url,timeout) {
    const _puppetInstance = await cModule.getPuppetInstance();
    const page = await _puppetInstance.newPage()
    await page.goto(url, {timeout: timeout, waitUntil: 'domcontentloaded'});
    await page.waitForSelector("#viewerContainer")

    const htmlContent = await page.content();

    console.log(htmlContent)

    /*
    const $ = cheerio.load(htmlContent, { xmlMode: true, decodeEntities: false });

    const chartsSvgs = []
    let chartContainers = $('#11dea102-7d86-4d82-8e96-d3f71c12246b')
    
    chartContainers.each(async (i, e) => {
        let chartHtml = $(e).html();
        const svgRegex = /<svg[\s\S]*?<\/svg>/;
        const svgMatch = chartHtml.match(svgRegex);
        const svgCleansed = svgMatch[0].replaceAll("\"","'")
        const buffer = Buffer.from(svgCleansed, 'utf-8');
        chartsSvgs.push("data:image/svg+xml;base64,"+buffer.toString('base64'))
    });
    return chartsSvgs
    */
}


const FINOPS_QUESTIONS = "https://www.docsity.com/en/finops-certified-practitioner-focp-actual-exam-questions-and-answers-with-explanations-2/10356781/"
// const FINOPS_QUESTIONS = "https://anvil.works/learn/examples/simple-website-guide"

async function finOpsQuestions() {
    await finOpsQuestionsRequest(FINOPS_QUESTIONS,6000)
    // console.log(data)
}


(async () => {
    await finOpsQuestions();
    console.log("done");
})()