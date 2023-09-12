const express = require('express');
const router = express.Router();
const responseAPI = require('../utils/response_api')
const axios = require('axios');
const { convertListGenre, convertListData } = require('../utils/convert_data');

router.get('/', async (req, res, next) => {
  try {
    const { BASE_URL } = process.env

    const url = `${BASE_URL}daftar-komik`

    await axios.get(url).then(async response => {
      const returnData = convertListGenre(response)

      res.json(responseAPI(true, returnData, 'Success!'))
    }).catch(err => {
      res.json(responseAPI(false, null, err.message ? err.message : "Something went wrong!"));
    })

  } catch (error) {
    return res.json(responseAPI(false, null, error.message ? error.message : "Something went wrong!"))
  }
})

router.get('/:genre_url', async (req, res, next) => {
  try {
    const { genre_url } = req.params
    
    const { BASE_URL } = process.env

    const url = `${BASE_URL}genres/${genre_url}`

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