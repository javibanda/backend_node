'use strict'
var express = require('express');


var ArticleController = require('../controller/article');

var router = express.Router();

router.get('/testController', ArticleController.test);
router.get('/test', ArticleController.datosCurso);

router.post('/save', ArticleController.save);
router.get('/getAllArticles/:last?', ArticleController.getArticles);
router.get('/getArticle/:id', ArticleController.getArticle);
router.put('/getArticle/:id', ArticleController.update);
router.delete('/deleteArticle/:id', ArticleController.delete);

module.exports = router;