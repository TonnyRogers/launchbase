const express = require('express')
const routes = express.Router()

const ProductController = require('../app/controllers/ProductController')
const SearchController = require('../app/controllers/SearchController')
const multer = require('../app/middlewares/multer')

routes.get('/search', SearchController.index)

routes.get('/create', ProductController.create)
routes.post('/', multer.array("photos", 6) , ProductController.store)
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', ProductController.edit)
routes.put('/', multer.array("photos", 6) , ProductController.update)

module.exports = routes; 