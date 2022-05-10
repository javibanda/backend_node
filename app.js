'use strict'

var express = require('express');
var bodyParse = require('body-parser');

var app = express();


var articleRoutes = require('./rutes/article');

app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

app.use('/', articleRoutes);

module.exports = app;