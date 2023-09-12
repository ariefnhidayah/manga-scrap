const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.json({
    title: "Welcome to Manga Verse API",
    description: "This is API to retrieve Indonesian language comic data"
  })
});

module.exports = router;
