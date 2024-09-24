const axios = require('axios');
// https://www.gold.co.uk/charts/data/099de6f2066d5/?period=3year&xignite_code=XAU&currency=GBP&weight_unit=ounces

const PM_HOST = "https://www.gold.co.uk"
const PM_SERIES_PATH = "charts/data/099de6f2066d5/?period=3year&xignite_code=XAU&currency=GBP&weight_unit=ounces"

const gold = async () => {
    try {
        const { data } = await axios.get(`${PM_HOST}/${PM_SERIES_PATH}`)
        return data.data
    } catch(e) {
        console.log(e)
    }
    return []
}

module.exports = {
    gold
}
