const axios = require('axios');
// const SMA = require('technicalindicators').SMA

const API_HOST = "https://charts.bgeometrics.com"

// https://charts.bgeometrics.com/files/sp500_yf.json
// https://charts.bgeometrics.com/files/btc_yf.json

/*
const jsonData = data.observations.reduce((array,el) => {
    if((el.value !== ".") && (new Date(el.date).getTime() > new Date("1990-01-01").getTime())) {
        array.push({
            time:el.date, 
            value: +((parseFloat(el.value))*scale).toFixed(2)
        })
    }
    return array;
}, []);    
*/

const getHistoricalValuesImpl = async (path) => {
    const hostPath = `${API_HOST}/files/${path}`
    const resource = `${hostPath}`

    try {
        const { data } = await axios.get(resource)
        const jsonData = data.reduce((array, el) => {
            const date = new Date(el[0]);
            const dateString = date.toISOString().slice(0, 10); // "YYYY-MM-DD"
            array.push({ time: dateString, value: +el[1] });
            return array;
          }, []);

        return {
            name: path,
            data: jsonData 
        }
    } catch (err) {
        return {data: err}
    }
}

module.exports = {
    getHistoricalValuesImpl
}
