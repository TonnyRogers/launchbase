const { formatPrice } = require('../../lib/utils')

const Category = require('../models/Category')
const Product = require('../models/Product')



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

        let result = await Product.store(req.body)
        const productId = result.rows[0].id

        return res.redirect(`/products/${productId}`)

    },
    async edit(req,res){

        let result = await Product.find(req.params.id)
        let product = result.rows[0]

        if(!product) return res.send({ message: 'Product not found' })

        product.price = formatPrice(product.price)
        product.old_price = formatPrice(product.old_price)
 
        result = await Category.all()
        const categories = result.rows

        return res.render('products/edit.njk', { product , categories } )
    },
    async update(req,res){
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