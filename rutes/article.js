'use strict'
var express = require('express');


var ArticleController = require('../controller/article');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/articles'});

router.get('/testController', ArticleController.test);
router.get('/test', ArticleController.datosCurso);

router.post('/save', ArticleController.save);
router.get('/getAllArticles/:last?', ArticleController.getArticles);
router.get('/getArticle/:id', ArticleController.getArticle);
router.put('/getArticle/:id', ArticleController.update);
router.delete('/deleteArticle/:id', ArticleController.delete);
router.post('/upload-image/:id', md_upload, ArticleController.uploadFile);
router.get('/getImage/:image', ArticleController.getImage);
router.get('/getImageById/:id', ArticleController.getImageById);
router.get('/searchArticle/:search', ArticleController.searchArticle);


module.exports = router;