const foolApi = require('./fool/fool-api.js');

const gettest = async (req, res) => {
    let data = await foolApi.getTestImpl()
    return res.status(200).json(data)
}

const getdata =  async (req, res) => {
    const { exchange, symbol, period } = req.query
    let data = await foolApi.getDataImpl(exchange,symbol,period)
    return res.status(200).json(data)
}

module.exports = {
    gettest,
    getdata
}
