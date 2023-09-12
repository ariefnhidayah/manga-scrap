const cheerio = require('cheerio')

function convertListData(response) {
	const htmlData = response.data
	const $ = cheerio.load(htmlData)

	const returnData = []

	$('.list-update_items-wrapper .list-update_item').each((index, elm) => {
		const item = {}
		item.title = $(elm).find('.list-update_item-info .title').text().trim()
		item.thumbnail = $(elm).find(".list-update_item-image").find(".wp-post-image").attr("src");
		if (item.thumbnail == '') {
			item.thumbnail = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7yrafa8McIQhNXeYMlMQXCnXMXvmVXKzWZQ&usqp=CAU'
		}
		item.chapter = $(elm).find('.chapter').text().trim()
		item.rating = $(elm).find(".list-update_item-info").find(".rating").find(".numscore").text().trim();

		const url = $(elm).find('a.data-tooltip').attr('href')

		const split = url.split('/')
		const pos = split.indexOf('komik')
		item.url = split[pos + 1]

		item.is_completed = false
		const status = $(elm).find('.list-update_item-image .status').text().trim()
		if (status == 'Completed') {
			item.is_completed = true
		}

		returnData.push(item)
	})

	return returnData;
}

function convertDetailData(response) {
	const htmlData = response.data
	const $ = cheerio.load(htmlData)

	let returnData = {}

	const article = $('#content .komik_info')[0]
	returnData.title = $(article).find('.komik_info-body .komik_info-content .komik_info-content-body .komik_info-content-body-title').text().trim()
	returnData.thumbnail = $(article).find('.komik_info-body .komik_info-content .komik_info-content-thumbnail img').attr('src')
	if (returnData.thumbnail == undefined) {
		returnData.thumbnail = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7yrafa8McIQhNXeYMlMQXCnXMXvmVXKzWZQ&usqp=CAU'
	}
	returnData.rating = $(article).find('.komik_info-body .komik_info-content .komik_info-content-rating .data-rating').attr('data-ratingkomik')
	returnData.description = $(article).find('.komik_info-body .komik_info-description .komik_info-description-sinopsis p').text().trim()

	$(article).find('.komik_info-body .komik_info-content .komik_info-content-body .komik_info-content-meta span').each((index, item) => {
		const value = $(item).text().trim().replace('\n', '')
		const arr = value.split(':')
		const id = arr[0].trim().replace(' ', '_').toLowerCase()
		const val = arr[1].trim()
		returnData[id] = val
	})

	let genres = []
	let genresData = []
	$(article).find('.komik_info-body .komik_info-content .komik_info-content-body .komik_info-content-genre a').each(async (index, item) => {
		const url = $(item).attr('href')

		const split = url.split('/')
		const pos = split.indexOf('genres')
		const fixedUrl = split[pos + 1]

		const text = $(item).text()
		genres.push(text)
		genresData.push({
			name: text,
			url: fixedUrl
		})
	})

	returnData.genres = genres.join(', ')
	returnData.genresData = genresData

	let chapters = []
	$(article).find('.komik_info-body #chapter-wrapper .komik_info-chapters-item').each((index, item) => {
		const url = $(item).find('a.chapter-link-item').attr('href')

		const split = url.split('/')
		const pos = split.indexOf('chapter')
		const fixedUrl = split[pos + 1]

		const chapter = $(item).find('a.chapter-link-item').text().trim().replace(/(\r\n|\n|\r)/gm, "").split(' ');

		const chapterName = []
		for (const row of chapter) {
			if (row != '') {
				chapterName.push(row)
			}
		}

		const date = $(item).find('.chapter-link-time').text().trim()
		chapters.push({
			chapter: chapterName.join(" "),
			date,
			url: fixedUrl,
		})
	})
	returnData.chapters = chapters

	return returnData
}

function convertListGenre(response) {
	const htmlData = response.data
	const $ = cheerio.load(htmlData)

	const returnData = []

	$('.komiklist_filter .genrez li').each((index, item) => {
		const label = $(item).find('label').text().trim()
		const id = $(item).find('.komiklist_filter-item').val()
		const url = `${label.replace(' ', '-').toLowerCase()}`
		const genre = {
			id,
			url,
			name: label,
		}
		returnData.push(genre)
	})

	return returnData
}

module.exports = {
	convertListData,
	convertDetailData,
	convertListGenre
}