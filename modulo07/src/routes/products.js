const express = require('express')
const routes = express.Router()

const ProductController = require('../app/controllers/ProductController')
const SearchController = require('../app/controllers/SearchController')
const multer = require('../app/middlewares/multer')

const { onlyUsers } = require('../app/middlewares/session')

const ProductValidator = require('../app/validators/products')

routes.get('/search', SearchController.index)

routes.get('/create', onlyUsers , ProductController.create)
routes.post('/',multer.array("photos", 6),ProductValidator.post , ProductController.store)
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', onlyUsers, ProductController.edit)
routes.put('/', multer.array("photos", 6), ProductValidator.update, ProductController.update)
routes.delete('/', ProductController.destroy)

module.exports = routes; 