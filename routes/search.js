const express = require('express');
const router = express.Router();
const responseAPI = require('../utils/response_api')
const axios = require('axios');
const { convertListData } = require('../utils/convert_data');
const Crawler = require("crawler");

router.get('/', async (req, res, next) => {
  try {
    const { q } = req.query

    const { BASE_URL } = process.env

    const request = new URLSearchParams({
      s: q ? q : '',
      post_type: 'manga'
    }).toString();

    const url = `${BASE_URL}cari/?${request}`

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