const express = require('express');
const router = express.Router();
const responseAPI = require('../utils/response_api')
const axios = require('axios');
const { convertListData } = require('../utils/convert_data');

router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query

    const { BASE_URL } = process.env

    const request = new URLSearchParams({
      s: q ? q : ''
    }).toString();

    const url = `${BASE_URL}?${request}`

    await axios.get(url).then(response => {
      const returnData = convertListData(response)

      res.json(responseAPI(true, returnData, 'Success!'))
    }).catch(err => {
      res.json(responseAPI(false, null, err.message ? err.message : "Something went wrong!"));
    })

  } catch (error) {
    return res.json(responseAPI(false, null, error.message ? error.message : "Something went wrong!"))
  }
})

module.exports = router