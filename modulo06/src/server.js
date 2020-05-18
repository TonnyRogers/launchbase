const express = require('express')
const routes = require('./routes')
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')
const session = require('./config/session')

const server = express()

server.use(session)
server.use(( req, res, next) => {
    res.locals.session = req.session

    next()
})
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.set("view engine","njk")
server.use(routes)

nunjucks.configure("src/app/views", {
    express:server,
    autoescape: false,
    noCache: true
})

server.listen(5000, function(){
    console.log('Server is Running');
})