const Category = require('../models/Category')

async function post(req,res,next) {

    const categories = await Category.findAll()

    const keys = Object.keys(req.body)
    let fieldsMessage = []

    for(key of keys){

        if(req.body[key] == "" ){
            fieldsMessage.push([`Please, fill the ${key} field`])
        }
    }

    if(fieldsMessage[0] != null){
        return res.render('products/create', { 
            error: 'Preencha todos os campos',
            product: req.body,
            categories
            })
    }
    

    if(!req.files || req.files.length == 0){
        return res.render('products/create', { 
            error: 'Envie no minimo 1 imagem',
            product: req.body,
            categories
        })
    }

    next()
}

async function update(req,res,next) {
    const keys = Object.keys(req.body)

    let fieldsMessage = []

    for(key of keys){

        if(req.body[key] == "" && key != 'removed_files'){
            fieldsMessage.push([`Please, fill the ${key} field`])
        }
    } 

    if(fieldsMessage[0] != null){
        return res.send({ alert: fieldsMessage })
    }

    next()
}

module.exports = {
    post,
    update
}