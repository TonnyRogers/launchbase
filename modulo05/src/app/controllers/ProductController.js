const { formatPrice } = require('../../lib/utils')

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')



module.exports = {
    create(req,res){
        Category.all()
        .then(function(result){

            const categories = result.rows

            return res.render('products/create.njk', { categories })
        }).catch(function(err){
            throw new Error(err)
        })
        
    },
    async store(req,res){ 

        const keys = Object.keys(req.body)
        let fieldsMessage = []

        for(key of keys){

            if(req.body[key] == "" ){
                fieldsMessage.push([`Please, fill the ${key} field`])
            }
        }

        if(fieldsMessage[0] != null){
            return res.send({ alert: fieldsMessage })
        }

        console.log(req.files)

        if(req.files.length == 0){
            return res.send({ message: 'Please, send at least one image ' })
        }

        let result = await Product.create(req.body)
        const productId = result.rows[0].id

        const filesPromise = req.files.map( file => File.create({ ...file, product_id: productId }))
        await Promise.all(filesPromise)

        return res.redirect(`/products/${productId}/edit`)

    },
    async edit(req,res){

        let result = await Product.find(req.params.id)
        let product = result.rows[0]

        if(!product) return res.send({ message: 'Product not found' })

        product.price = formatPrice(product.price)
        product.old_price = formatPrice(product.old_price)
 
        result = await Category.all()
        const categories = result.rows

        result = await Product.files(product.id)
        let files = result.rows
        
        files = files.map( file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }))

        return res.render('products/edit.njk', { product , categories, files } )
    },
    async update(req,res){
        const keys = Object.keys(req.body)

        let fieldsMessage = []

        for(key of keys){

            if(req.body[key] == "" && key != 'removed_files'){
                fieldsMessage.push([`Please, fill the ${key} field`])
            }
        }

        if(req.files.length != 0){
            const newFilePromisse = req.files.map( file => File.create({ ...file, product_id: req.body.id }))
            await Promise.all(newFilePromisse)
        }

        if(req.body.removed_files){
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)
 
            const removedFilesPromise = removedFiles.map( id => File.delete(id) )
            await Promise.all(removedFilesPromise)
        }

        if(fieldsMessage[0] != null){
            return res.send({ alert: fieldsMessage })
        }

        let result = await Product.find(req.body.id)
        let product = result.rows[0]

        if(!product) return res.send({ message: 'Product not found' })

        req.body.price = req.body.price.replace(/\D/g,"")
        
        if(req.body.old_price != req.body.price){
            req.body.old_price = product.price
        } 

        await Product.update(req.body)

        return res.redirect(`/products/${req.body.id}/edit`)


    }
}