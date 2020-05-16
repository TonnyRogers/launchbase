const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/UserController')

// routes.get('/login', SessionController.loginForm)
// routes.post('/login', SessionController.login)
// routes.post('/logout', SessionController.logout)

// routes.get('/forgot-password', SessionController.forgotForm)
// routes.get('/password-reset', SessionController.resetForm)
// routes.post('/forgot-password', SessionController.forgot)
// routes.post('/password-reset', SessionController.reset)

routes.get('/register', UserController.create)
routes.post('/register', UserController.store)
routes.get('/register', UserController.show)
routes.put('/register', UserController.update)
routes.delete('/register', UserController.destroy)

module.exports = routes; 