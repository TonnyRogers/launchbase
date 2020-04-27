const express = require('express')
const routes = express.Router()
const instructors = require('./controllers/instructors')
const members = require('./controllers/members')

routes.get('/', function(req,res){
    return res.redirect('/instructors');
})

routes.get('/instructors', instructors.index)
routes.get('/instructors/create', instructors.create)
routes.get('/instructors/:id', instructors.show )
routes.post('/instructors', instructors.store)
routes.get('/instructors/:id/edit', instructors.edit)
routes.put('/instructors', instructors.update)
routes.delete('/instructors', instructors.destroy)

routes.get('/members', members.index)
routes.get('/members/create', members.create) 
routes.get('/members/:id', members.show )
routes.post('/members', members.store)
routes.get('/members/:id/edit', members.edit)
routes.put('/members', members.update)
routes.delete('/members', members.destroy)

module.exports = routes; 
