const express = require('express');
const router = express.Router();
const responseAPI = require('../utils/response_api')
const axios = require('axios');
const { convertListData, convertDetailData } = require('../utils/convert_data');

router.get('/', async (req, res, next) => {
	try {
		let { order, type, page, status, genre } = req.query
		page = page ? page : 1

		// let request
		// if (genre) {
		// 	request = new URLSearchParams({
		// 		orderby: order ? order : '',
		// 		type: type ? type : '',
		// 		status: status ? status : '',
		// 		'genre[]': genre ? genre : ''
		// 	})
		// } else {
		// 	request = new URLSearchParams({
		// 		orderby: order ? order : '',
		// 		type: type ? type : '',
		// 		status: status ? status : '',
		// 	})
		// }
		const request = new URLSearchParams({
			orderby: order ? order : '',
			type: type ? type : '',
			status: status ? status : '',
		})

		const { BASE_URL } = process.env

		const url = `${BASE_URL}daftar-komik/page/${page}/?${request}`

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

router.get('/:comic_url', async (req, res, next) => {
	try {
		const { comic_url } = req.params

		const { BASE_URL } = process.env

		const url = `${BASE_URL}komik/${comic_url}`

		await axios.get(url).then(response => {
			const returnData = convertDetailData(response)

			res.json(responseAPI(true, {...returnData, url}, 'Success!'))
		}).catch(err => {
			res.json(responseAPI(false, null, err.message ? err.message : "Something went wrong!"));
		})

	} catch (error) {
		return res.json(responseAPI(false, null, error.message ? error.message : "Something went wrong!"))
	}
})

module.exports = router