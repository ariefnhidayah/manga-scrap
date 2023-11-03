const express = require('express');
const router = express.Router();
const responseAPI = require('../utils/response_api')
const axios = require('axios');
const { convertListGenre, convertListData } = require('../utils/convert_data');
const Crawler = require("crawler");

router.get('/', async (req, res, next) => {
	try {
		const { BASE_URL } = process.env

		const url = `${BASE_URL}other/rekomendasi/`

		const c = new Crawler({
			rateLimit: 1000,
			maxConnections: 1,
			referer: 'https://komiku.id/',
			callback: (error, result, done) => {
				if (error) {
					return res.status(500).json(error);
				} else {
					const $ = result.$;
					const genres = []
					$('#Filter').find('select[name=genre2]').find('option').each((i, el) => {
						const value = $(el).val()
						const text = $(el).text()
						if (value != '') {
							genres.push({
								url: value,
								name: text
							})
						}
					})

					res.json(responseAPI(true, genres, url))
					done()
				}
			}
		})

		c.queue(url)

	} catch (error) {
		return res.json(responseAPI(false, null, error.message ? error.message : "Something went wrong!"))
	}
})

router.get('/:genre_url', async (req, res, next) => {
	try {
		const { genre_url } = req.params

		let { page } = req.query
		page = page ? parseInt(page) : 1

		const { BASE_URL } = process.env

		let url
		if (page === 1) {
			url = `${BASE_URL}other/rekomendasi/?genre2=${genre_url}`
		} else {
			url = `${BASE_URL}other/rekomendasi/page/${page}/?genre2=${genre_url}`
		}

		var c = new Crawler({
			rateLimit: 1000,
			maxConnections: 1,
			referer: 'https://komiku.id/',
			callback: (error, result, done) => {
				if (error) {
					console.log(error);
					return res.status(500).json(error);
				} else {
					var $ = result.$;

					const mangaList = [];

					$(".daftar")
						.find(".bge")
						.each((i, el) => {
							const mangaTitle = $(el).find(".kan").find("h3").text();
							const mangaDescription = $(el).find(".kan").find("p").text();
							const mangaThumbnail = $(el).find(".bgei").find("img").data("src");
							const mangaParam = $(el)
								.find(".kan")
								.find("a")
								.eq(0)
								.attr("href")
								.split("/")[4];
							const latestChapter = $(el)
								.find(".kan")
								.find(".new1")
								.last()
								.find("span")
								.last()
								.text();

							let trimmedTitle = mangaTitle;
							if (mangaTitle) {
								trimmedTitle = mangaTitle.trim();
							}

							let trimmedDescription = mangaDescription;
							if (mangaDescription) {
								trimmedDescription = mangaDescription.trim().replace("  ", " ");
							}

							mangaList.push({
								title: trimmedTitle,
								description: trimmedDescription,
								latest_chapter: latestChapter,
								thumbnail: mangaThumbnail.split("?")[0],
								url: mangaParam,
							});
						});
					res.json(responseAPI(true, mangaList, url))
					done()
				}
			}
		})

		c.queue(url)

	} catch (error) {
		return res.json(responseAPI(false, null, error.message ? error.message : "Something went wrong!"))
	}
})

module.exports = router