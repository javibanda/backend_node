'use strict'
const URL = "mongodb://localhost:27017/api_rest_blog"
let OPTION = {useNewUrlParser: true};
var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;



mongoose.Promise = global.Promise;

mongoose.connect(URL, OPTION).then(() => {
    console.log("Connection = true");

    app.listen(port, () =>{
       console.log('Servidor corriendo en http://localhost:' + port);
    });
});

