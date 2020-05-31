const express = require('express')
const routes = express.Router()

const OrderController = require('../app/controllers/OrderController')

const { isLoggedRedirect, onlyUsers } = require('../app/middlewares/session')

routes.post('/',onlyUsers, OrderController.store)
routes.get('/',onlyUsers, OrderController.index)
routes.get('/sales', onlyUsers, OrderController.sales )
routes.get('/:id', onlyUsers, OrderController.show )

module.exports = routes; 