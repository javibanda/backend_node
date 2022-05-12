'use strict'

var validator = require('validator');
var Article = require('../model/article');
var fileSistem = require('fs');
var path = require('path');






var controller = {

    datosCurso:  (req, res)=>{
        console.log('hola mundo');
        return res.status(200).send({
            curso: 'Master Node',
            autor: 'Javier Polo',
            url: 'javi.es'
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la accion test de mi controlador de articulos'
        });
    },
    save: (req, res) =>{

        let params = req.body;


        let validateTitle, validateContent;
        try{
             validateTitle = !validator.isEmpty(params.title);
             validateContent = !validator.isEmpty(params.content);

        }catch (err){
            console.log('Entra en el catch');
        }

        if(validateTitle && validateContent){

            var article = new Article();
            article.title = params.title;
            article.content = params.content;
            article.image = null;
            article.save((err, articleStored) => {
                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado'
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                })
            });

            console.log('Datos validos');
            console.log(article);

        }else{
            return res.status(200).send({
                message: 'Los datos no son validos'
            });
        }

    },

    getArticles: (req, res) =>{
        var query = Article.find({});
        var last = req.params.last;
        console.log(last);

        if(last || last != undefined){
            query.limit(5);
        }
        query.exec((err, articles) =>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los artículos'
                })
            }
            if(!articles){
                return res.status(404).send({
                    status: 'error',
                    message: 'Error al devolver los artículos'
                })
            }
            console.log(articles);
            return res.status(200).send({
                message: 'Success',
                articles
            });
        });
    },

    getArticle: (req, res) =>{

        var id = req.params.id;

        if(!id || id == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            });
        }

        Article.findById(id, (err, article) =>{


            if(!article || err){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo buscado'
                });
            }

            return res.status(200).send({
                status: 'success',
                article
            })
        });





    },
    update: (req, res) =>{
        var articleId = req.params.id;

        var params = req.body
        try{
            var validateTittle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);

        }catch (err){
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if(validateTittle && validateContent){
            Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdated) =>{
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'La validación no es correcta'
                    });
                }

                if(!articleUpdated){
                    if(err){
                        return res.status(500).send({
                            status: 'error',
                            message: 'No existe el artículo'
                        });
                    }
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });

            });
        }else{
            return res.status(404).send({
                status: 'error',
                message: 'La validación no es correcta'
            });
        }


    },

    delete: (req, res) => {
        var articleId = req.params.id;

            Article.findOneAndDelete({_id: articleId}, (err, articleRemove) =>{
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al borrar'
                    });
                }

                if(!articleRemove){
                        return res.status(404).send({
                            status: 'error',
                            message: 'No existe el artículo'
                        });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleRemove
                });
            });

    },

    uploadFile: (req, res) => {
        console.log(req.files);
        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: 'Imagen no subida...'
            });
        }

        var filePath = req.files.file0.path;
        var fileSplit = filePath.split('\\');

        var fileName = fileSplit[2];

        var fileExtension = fileName.split('\.')[1];



        if(fileExtension !== 'png' && fileExtension !== 'jpg' && fileExtension !== 'jpeg' && fileExtension !== 'gif'){

            fileSistem.unlink(filePath, (err) =>{
                return res.status(400).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es valida'
                })
            });

        }else{
            var articleId = req.params.id;
            Article.findById(articleId, (err, article) =>{

                if(article.image != null){
                    fileSistem.unlink(fPath(article.image), (err) =>{});
                }

            });



            Article.findOneAndUpdate({_id: articleId}, {image: fileName}, {new:true}, (err, articleUpdated) =>{

                if(err || !articleUpdated){
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al guardar la imagen'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    articleUpdated
                });
            });

        }

    },

    getImage: (req, res) => {
        let file = req.params.image;

        let pathFile = fPath(file);

        fileSistem.exists(pathFile, (exist) =>{
            if(exist){
                return  res.sendFile(path.resolve(pathFile));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        })

    },

    getImageById: (req, res) => {
        let articleId = req.params.id;

        Article.findById(articleId, (err, article) =>{


            if(!article || err){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo buscado'
                });
            }
            let articleImage = article.image;
            if(articleImage != null){
                let pathFile = fPath(articleImage);
                fileSistem.exists(pathFile, (exist) =>{
                    if(exist){
                        return  res.sendFile(path.resolve(pathFile));
                    }else{
                        return res.status(404).send({
                            status: 'error',
                            message: 'La imagen no existe'
                        });
                    }
                })
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'El artículo no tiene imagen'
                });
            }

        });

    },

    searchArticle: (req, res) =>{
        var searchString = req.params.search;
        console.log('1');

        Article.find({ "$or":[
                {"title": {"$regex": searchString, "$options": "i"} },
                {"content": {"$regex": searchString, "$options": "i"}}
            ]})
            .sort([['date', 'descending']])
            .exec((err, articles) =>{
                console.log('2');
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición!!!',
                        searchString
                    });
                }

                if(!articles || articles.length <= 0){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el artículo que contenga '
                    });
                }
                console.log('2');

                return res.status(500).send({
                    status: 'success',
                    articles
                });

            });
        console.log('2');
    }

};//end controller

function fPath(nameFile){
    return 'upload\\articles\\' + nameFile;
}

module.exports = controller;