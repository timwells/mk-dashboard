const hlApi = require('./hl/hl-api.js');

const test = async (req, res) => {
    let data = await hlApi.testImpl()
    return res.status(200).json(data)
}

const fundslist =  async (req, res) => {
    // const { exchange, symbol, period } = req.query
    let data = await hlApi.fundsListImpl()
    return res.status(200).json(data)
}

module.exports = {
    test,
    fundslist
}

