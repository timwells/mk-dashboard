const axios = require('axios');
const API_KEY = "7fae4045a509aeb9d5b7d20e7690ba66"
const API_HOST = "https://api.stlouisfed.org"
const API_OBSERVATIONS_PATH = "fred/series/observations"

// https://api.stlouisfed.org/fred/series/observations?series_id=UNRATE&api_key=7fae4045a509aeb9d5b7d20e7690ba66&file_type=json&frequency=m&output_type=1&units=pc1
/*
"observations": [
    {
        "realtime_start": "2024-08-05",
        "realtime_end": "2024-08-05",
        "date": "1948-01-01",
        "value": "."
    },
    {
        "realtime_start": "2024-08-05",
        "realtime_end": "2024-08-05",
        "date": "1948-02-01",
        "value": "."
    },
    {
        "realtime_start": "2024-08-05",
        "realtime_end": "2024-08-05",
        "date": "1948-03-01",
        "value": "."
    },
    {
        "realtime_start": "2024-08-05",
        "realtime_end": "2024-08-05",
        "date": "1948-04-01",
        "value": "."
    },
    {
        "realtime_start": "2024-08-05",
        "realtime_end": "2024-08-05",
        "date": "1948-05-01",
        "value": "."
    },
    ...
]
*/

const observations = async (seriesId,frequency,units) => {
    const resource = `${API_HOST}/${API_OBSERVATIONS_PATH}?series_id=${seriesId}&api_key=${API_KEY}&file_type=json&frequency=${frequency}&output_type=1&units=${units}`
    const {data} = await axios.get(resource);

    const jsonData = data.observations.reduce((array,el) => {
        if(el.value !== ".") {
            array.push([new Date(el.date).getTime(), +parseFloat(el.value).toFixed(2)])
        }
        return array;
    }, []);
    
    return { name: seriesId, src:"src", data: jsonData }
    // return { name: `${seriesId}-${m}-${units}`, data: jsonData }
}

module.exports = {
    observations
}
