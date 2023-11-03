const express = require('express');
const router = express.Router();
const responseAPI = require('../utils/response_api')
const axios = require('axios');
const cheerio = require('cheerio');
const Crawler = require('crawler');

router.get('/:chapter_url', async (req, res, next) => {
  try {

    const { BASE_URL } = process.env
    const { chapter_url } = req.params

    const url = `https://komiku.id/ch/${chapter_url}`

    const c = new Crawler({
      rateLimit: 1000,
			maxConnections: 1,
			referer: 'https://komiku.id/',
      callback: (error, result, done) => {
        if (error) {
          console.log(error);
          return res.status(500).json(error);
        } else {
          var $ = result.$;
          const chapterImages = []
          $("#Baca_Komik img").each((i, el) => {
            const imageUrl = $(el).attr("src");

            if (imageUrl != undefined) {
              imageUrl.replace("img.komiku.id", "cdn.komiku.co.id");
              chapterImages.push(imageUrl);
            }
          });
          res.json(responseAPI(true, chapterImages, url));
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