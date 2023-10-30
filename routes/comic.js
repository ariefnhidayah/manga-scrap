const express = require('express');
const router = express.Router();
const responseAPI = require('../utils/response_api')
const axios = require('axios');
const { convertListData, convertDetailData } = require('../utils/convert_data');
const Crawler = require("crawler");

router.get('/', async (req, res, next) => {
	try {
		let { order, type, page } = req.query
		page = page ? parseInt(page) : 1
		type = type ? type : ''

		const { BASE_URL } = process.env

		let url = ``

		if (order == 'popular') {
			if (page === 1) {
				url = `${BASE_URL}other/hot/?category_name=${type}`
			} else {
				url = `${BASE_URL}other/hot/page/${page}/`
			}
		} else {
			if (page === 1) {
				url = `${BASE_URL}other/rekomendasi/?orderby=modified&category_name=${type}`
			} else {
				url = `${BASE_URL}other/rekomendasi/page/${page}/`
			}
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
		return res.status(500).json(responseAPI(false, null, error.message ? error.message : "Something went wrong!"))
	}
})

router.get('/:comic_url', async (req, res, next) => {
	try {
		const { comic_url } = req.params

		const { BASE_URL } = process.env

		const url = `https://komiku.id/manga/${comic_url}`

		const c = new Crawler({
			maxConnections: 16,
			referer: "https://komiku.id/",
			// This will be called for each crawled page
			callback: (error, result, done) => {
				if (error) {
					console.log(error);

					res.json({
						data: error.message,
					});
				} else {
					const $ = result.$;

					const mangaTitle = $("#Judul h1").text().trim();
					const mangaThumbnail = $(".ims img").attr("src");
					const mangaGenre = [];
					const mangaSynopsis = $("#Judul").find(".desc").text().trim();
					const mangaChapters = [];

					$(".genre li a").each((i, el) => {
						mangaGenre.push($(el).text());
					});

					$("#Daftar_Chapter tbody tr").each((i, el) => {
						if (i > 0) {
							const chapterNumber = $(el).find(".judulseries").text().trim();
							const chapterSlug = $(el)
								.find(".judulseries")
								.find("a")
								.attr("href")
								.split("/")[2];
							const chapterRelease = $(el).find(".tanggalseries").text().trim();

							mangaChapters.push({
								chapter: chapterNumber,
								url: chapterSlug,
								release: chapterRelease,
							});
						}
					});

					let trimmedTitle = mangaTitle;
					if (mangaTitle) {
						trimmedTitle = mangaTitle.trim();
					}

					const data = {
						title: trimmedTitle,
						thumbnail: mangaThumbnail,
						genre: mangaGenre,
						sinopsis: mangaSynopsis,
						chapters: mangaChapters,
					}

					return res.json(responseAPI(true, data, url))
				}

				done();
			},
		});

		c.queue(url);

	} catch (error) {
		return res.status(500).json(responseAPI(false, null, error.message ? error.message : "Something went wrong!"))
	}
})

module.exports = router