

const Product = require('../models/Product')

const LoadProductService = require('../services/LoadProductService')

module.exports = {
    async index(req,res) {
        try {
            let params = {}

            const { filter, category } = req.query

            if(!filter) return res.redirect('/')

            params.filter = filter

            if(category){
                params.category = category
            }

            let products = await Product.search(params)
            
            const productPromisse = products.map(LoadProductService.format)

            products = await Promise.all(productPromisse)

            const search = {
                term: req.query.filter,
                total: products.length
            }
            
            const categories = products.map( product => ({
                id: product.category_id,
                name: product.category_name
            })).reduce( (categoryFiltered, category) => {
                const found = categoryFiltered.some(cat => cat.id == category.id)
                
                if(!found){
                    categoryFiltered.push(category)
                }

                return categoryFiltered
            }, [])
            
            return res.render('search/index.njk', { products, search, categories })
        } catch (error) {
            console.error(error);
            
        }
    }
}