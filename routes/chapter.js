const express = require('express');
const router = express.Router();
const responseAPI = require('../utils/response_api')
const axios = require('axios');
const cheerio = require('cheerio')

router.get('/:chapter_url', async (req, res, next) => {
  try {

    const { BASE_URL } = process.env
    const { chapter_url } = req.params

    const url = `${BASE_URL}chapter/${chapter_url}`

    await axios.get(url).then(response => {
      const htmlData = response.data
      const $ = cheerio.load(htmlData)

      let returnData = []

      let data = $('.main-reading-area')
      $(data).find('img').each((index, item) => {
        const img = $(item).attr('src')
        returnData.push(img)
      })

      res.json(responseAPI(true, returnData, 'Success!'))
    }).catch(err => {
      res.json(responseAPI(false, null, err.message ? err.message : "Something went wrong!"));
    })

  } catch (error) {
    return res.json(responseAPI(false, null, error.message ? error.message : "Something went wrong!"))
  }
})

module.exports = router