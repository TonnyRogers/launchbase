const fs = require('fs')

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

const LoadProductService = require('../services/LoadProductService')


module.exports = {
    async create(req,res){

        try {

            const categories = await Category.findAll()
            return res.render('products/create', { categories })

        } catch (error) {
            console.error(error)
        }

    },
    async store(req,res){ 

        try {

            req.body.user_id = req.session.userId

            let { name, category_id, price, old_price, description, quantity, status } = req.body

            price = price.replace(/\D/g, "")

            const product_id = await Product.create({
                name,
                category_id,
                user_id: req.session.userId,
                price, 
                old_price: old_price || price , 
                description, 
                quantity, 
                status: status || 1
            }) 

            const filesPromise = req.files.map( file => File.create({ name: file.filename, path: file.path , product_id}))
            await Promise.all(filesPromise)

            return res.redirect(`/products/${product_id}/edit`)

        } catch (error) {
            console.error(error);
            
        }

        

    },
    async show(req,res){
        try {
            let product= await LoadProductService.load('product', {
                where: { id: req.params.id }
            })

            if(!product) return res.render('home/index',{ 
                error: 'Produto não encontrado',
                user: req.body
            })

            res.render('products/show', { product })

        } catch (error) {
            console.error(error);
        }

    },
    async edit(req,res){

        try {
            let product = await LoadProductService.load('product', {
                where: { id: req.params.id }
            })

            if(!product) return res.render('home/index',{ error: 'Produto não encontrado' })
    
            const categories = await Category.findAll()

            return res.render('products/edit', { product , categories } )

        } catch (error) {
            console.error(error);
            
        }
    },
    async update(req,res){
        try {

            if(req.files.length != 0){
                const newFilePromisse = req.files.map( file => File.create({ name: file.filename, path: file.path, product_id: req.body.id }))
                await Promise.all(newFilePromisse)
            }

            if(req.body.removed_files){
                const removedFiles = req.body.removed_files.split(",")
                const lastIndex = removedFiles.length - 1
                removedFiles.splice(lastIndex, 1)
    
                const removedFilesPromise = removedFiles.map( id => File.delete(id) )
                await Promise.all(removedFilesPromise)
            }

            let product = await Product.find(req.body.id)

            if(!product) return res.send({ message: 'Product not found' })

            req.body.price = req.body.price.replace(/\D/g,"")
            
            if(req.body.old_price != req.body.price){
                req.body.old_price = product.price
            } 

            const { name, category_id, price, old_price, description, status, quantity, id } = req.body

            await Product.update(id,{
                name,
                category_id, 
                price, 
                old_price, 
                description, 
                status, 
                quantity
            })

            return res.redirect(`/products/${req.body.id}`)
            
        } catch (error) {
            console.error(error);
            
        }


    },
    async destroy(req,res){
       try {

            const files = await Product.files(req.body.id)

            await Product.delete(req.body.id)

            files.map( file => fs.unlinkSync(file.path))

            return res.render('home/index',{ success: 'Produto Removido'} )
       } catch (error) {
           console.error(error); 
           
       }

    }
}