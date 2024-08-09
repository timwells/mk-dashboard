const axios = require('axios');
const fedApi = require('./fed/fed-api.js')

const SAHMREALTIME = "https://fred.stlouisfed.org/graph/fredgraph.csv?bgcolor=%23e1e9f0&chart_type=line&drp=0&fo=open%20sans&graph_bgcolor=%23ffffff&height=450&mode=fred&recession_bars=on&txtcolor=%23444444&ts=12&tts=12&width=720&nt=0&thu=0&trc=0&show_legend=yes&show_axis_titles=yes&show_tooltip=yes&id=SAHMREALTIME&scale=left&cosd=1959-12-01&coed=2024-07-01&line_color=%234572a7&link_values=false&line_style=solid&mark_type=none&mw=3&lw=2&ost=-99999&oet=99999&mma=0&fml=a&fq=Monthly&fam=avg&fgst=lin&fgsnd=2020-02-01&line_index=1&transformation=lin&vintage_date=2024-08-02&revision_date=2024-08-02&nd=1959-12-01"
const UNRATE = "https://fred.stlouisfed.org/graph/fredgraph.csv?bgcolor=%23e1e9f0&chart_type=line&drp=0&fo=open%20sans&graph_bgcolor=%23ffffff&height=450&mode=fred&recession_bars=on&txtcolor=%23444444&ts=12&tts=12&width=720&nt=0&thu=0&trc=0&show_legend=yes&show_axis_titles=yes&show_tooltip=yes&id=UNRATE&scale=left&cosd=1948-01-01&coed=2024-07-01&line_color=%234572a7&link_values=false&line_style=solid&mark_type=none&mw=3&lw=2&ost=-99999&oet=99999&mma=0&fml=a&fq=Monthly&fam=avg&fgst=lin&fgsnd=2020-02-01&line_index=1&transformation=lin&vintage_date=2024-08-02&revision_date=2024-08-02&nd=1948-01-01"
const T10Y2Y = "https://fred.stlouisfed.org/graph/fredgraph.csv?bgcolor=%23e1e9f0&chart_type=line&drp=0&fo=open%20sans&graph_bgcolor=%23ffffff&height=450&mode=fred&recession_bars=on&txtcolor=%23444444&ts=12&tts=12&width=1140&nt=0&thu=0&trc=0&show_legend=yes&show_axis_titles=yes&show_tooltip=yes&id=T10Y2Y&scale=left&cosd=1976-06-01&coed=2024-08-02&line_color=%234572a7&link_values=false&line_style=solid&mark_type=none&mw=2&lw=2&ost=-99999&oet=99999&mma=0&fml=a&fq=Monthly&fam=avg&fgst=lin&fgsnd=2009-06-01&line_index=1&transformation=lin&vintage_date=2024-08-03&revision_date=2024-08-03&nd=1976-06-01"
const WTI = "https://fred.stlouisfed.org/graph/fredgraph.csv?bgcolor=%23e1e9f0&chart_type=line&drp=0&fo=open%20sans&graph_bgcolor=%23ffffff&height=450&mode=fred&recession_bars=on&txtcolor=%23444444&ts=12&tts=12&width=960&nt=0&thu=0&trc=0&show_legend=yes&show_axis_titles=yes&show_tooltip=yes&id=MCOILWTICO&scale=left&cosd=1986-01-01&coed=2024-06-01&line_color=%234572a7&link_values=false&line_style=solid&mark_type=none&mw=3&lw=2&ost=-99999&oet=99999&mma=0&fml=a&fq=Monthly&fam=avg&fgst=lin&fgsnd=2020-02-01&line_index=1&transformation=lin&vintage_date=2024-08-04&revision_date=2024-08-04&nd=1986-01-01"

// https://fred.stlouisfed.org/graph/fredgraph.csv?bgcolor=%23e1e9f0&chart_type=line&drp=0&fo=open%20sans&graph_bgcolor=%23ffffff&height=450&mode=fred&recession_bars=on&txtcolor=%23444444&ts=12&tts=12&width=960&nt=0&thu=0&trc=0&show_legend=yes&show_axis_titles=yes&show_tooltip=yes&id=SP500&scale=left&cosd=2014-08-04&coed=2024-08-02&line_color=%234572a7&link_values=false&line_style=solid&mark_type=none&mw=3&lw=2&ost=-99999&oet=99999&mma=0&fml=a&fq=Daily%2C%20Close&fam=avg&fgst=lin&fgsnd=2020-02-01&line_index=1&transformation=lin&vintage_date=2024-08-03&revision_date=2024-08-03&nd=2014-08-04
const VIXCLS = "https://fred.stlouisfed.org/graph/fredgraph.csv?bgcolor=%23e1e9f0&chart_type=line&drp=0&fo=open%20sans&graph_bgcolor=%23ffffff&height=450&mode=fred&recession_bars=on&txtcolor=%23444444&ts=12&tts=12&width=720&nt=0&thu=0&trc=0&show_legend=yes&show_axis_titles=yes&show_tooltip=yes&id=VIXCLS&scale=left&cosd=1990-01-02&coed=2024-08-01&line_color=%234572a7&link_values=false&line_style=solid&mark_type=none&mw=3&lw=2&ost=-99999&oet=99999&mma=0&fml=a&fq=Daily%2C%20Close&fam=avg&fgst=lin&fgsnd=2020-02-01&line_index=1&transformation=lin&vintage_date=2024-08-04&revision_date=2024-08-04&nd=1990-01-02"



/*
function getLastDayOfEachMonth(data) {
    // Object to hold the last day of each month
    const lastYearMonthDayMap = [];
    data.forEach(entry => {
//             array.push([new Date(els[0]).getTime(), +parseFloat(els[1])])
        const date = new Date(entry.date);
        const yearMonth = date.getFullYear() + '-' + (date.getMonth() + 1); // Format as 'YYYY-M'

        // Only replace the entry if the current date is later in the month
        if (!lastDayMap[yearMonth] || date > new Date(lastDayMap[yearMonth].date)) {
            lastDayMap[yearMonth] = entry;
        }
    });
*/
const downloadDataSet = async(resource,name,reduce) => {
    const {data} = await axios.get(resource)
    const lines = data.split("\n")
    let jsonData = lines.reduce((array,el,index) => {
        if(index > 0) {
            const els = el.split(",")
            array.push([new Date(els[0]).getTime(), +parseFloat(els[1])])
        } return array;
    }, []);

    return { name:name, data:jsonData}
}
const unrate = async(req,res) => {
    const {data} = await axios.get(UNRATE)
    const lines = data.split("\n")    
    const headers = lines[0].split(",")
    const f1 = headers[0].toLowerCase()
    const f2 = headers[1].toLowerCase()

    let jsonData = lines.reduce((array,el,index) => {
        if(index > 0) {
            const els = el.split(",")
            array.push([new Date(els[0]).getTime(), +parseFloat(els[1])])
        } return array;
    }, []);

    res.status(200).json({ name:"unrate", data:jsonData })
}
const sahmrealtime = async(req,res) => {
    const {data} = await axios.get(SAHMREALTIME)
    const lines = data.split("\n")    
    const headers = lines[0].split(",")
    const f1 = headers[0].toLowerCase()
    const f2 = headers[1].toLowerCase()

    let jsonData = lines.reduce((array,el,index) => {
        if(index > 0) {
            const els = el.split(",")
            array.push([new Date(els[0]).getTime(), +parseFloat(els[1]) ])
        } return array;
    }, []);

    res.status(200).json({ name:"sahmrealtime", data:jsonData })
}
const sahmrealtimeunrate = async(req,res) => {
    const r1 = await axios.get(UNRATE)
    const unrateLines = r1.data.split("\n")

    const r2 = await axios.get(SAHMREALTIME)
    const sahmrealtimeLines = r2.data.split("\n")    

    let jsonUnRateData = unrateLines.reduce((array,el,index) => {
        if(index > 0) {
            const els = el.split(",")
            array.push([new Date(els[0]).getTime(), +parseFloat(els[1])])
        } return array;
    }, []);

    let jsonSahmRealTimeData = sahmrealtimeLines.reduce((array,el,index) => {
        if(index > 0) {
            const els = el.split(",")
            array.push([new Date(els[0]).getTime(), +parseFloat(els[1])])
        } return array;
    }, []);

    let jsonData = []
    jsonData.push({ name:"unrate", data:jsonUnRateData})
    jsonData.push({ name:"sahmrealtime", data:jsonSahmRealTimeData })

    res.status(200).json(jsonData)
}
const indicators = async(req,res) => {
    let jsonData = []
    let resources = [
        [UNRATE,"unrate"],
        [SAHMREALTIME,"sahm"],
        [WTI,"wti"],
        //[T10Y2Y,"t10y2y"]
    ]

    for(let i = 0; i < resources.length; i++) {
        const ds = await downloadDataSet(resources[i][0],resources[i][1])
        jsonData.push(ds)
    }
    return res.status(200).json(jsonData)
}
const test = async (req, res) => {
    res.status(200).send("FED.test")
}
const observations =  async (req, res) => {
    const seriesId = req.query.seriesId;
    const frequency = req.query.frequency;
    const units = req.query.units;
    let scale = req.query.scale;
    if(scale == undefined) scale = "1.0";
    const jsonData = await fedApi.observations(seriesId,frequency,units,parseFloat(scale))
    return res.status(200).json(jsonData)
}

module.exports = {
    test,
    sahmrealtime,
    unrate,
    sahmrealtimeunrate,
    indicators,
    observations,
}
