const Product = require('../models/Product')

const LoadProductService = require('../services/LoadProductService')

module.exports = {
    async index(req,res) {
        try {
            let { filter, category } = req.query

            // params.filter = filter

            if(!filter || filter.toLowerCase() == 'toda a loja' ) filter = null 

            let products = await Product.search({filter,category})
            
            const productPromisse = products.map(LoadProductService.format)

            products = await Promise.all(productPromisse)

            const search = {
                term: filter || 'Toda a loja',
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