const express = require('express')
const routes = express.Router()

const ProductController = require('../app/controllers/ProductController')
const SearchController = require('../app/controllers/SearchController')
const multer = require('../app/middlewares/multer')

const { onlyUsers } = require('../app/middlewares/session')

routes.get('/search', SearchController.index)

routes.get('/create', onlyUsers , ProductController.create)
routes.post('/',onlyUsers, multer.array("photos", 6) , ProductController.store)
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', onlyUsers, ProductController.edit)
routes.put('/', onlyUsers, multer.array("photos", 6) , ProductController.update)
routes.delete('/', onlyUsers, ProductController.destroy)

module.exports = routes; 