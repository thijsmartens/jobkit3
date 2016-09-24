var express = require('express');
var router = express.Router();

router.get('/about', function(req, res, next) {
    res.render('about/about');
});

router.get('/contact', function(req, res, next) {
    res.render('about/contact');
});

router.get('/faq', function(req, res, next) {
    res.render('about/faq');
});

module.exports = router;