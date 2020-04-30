const { age, date } = require('../../lib/utils')
const Instructor = require('../models/instructor')

module.exports  = {

    index(req,res){
        const { filter } = req.query

        if( filter ){
            Instructor.findBy(filter,function(instructors){
                return res.render('instructors/index', { instructors, filter })
            })
        }else{
            Instructor.all(function(instructors){

                return res.render('instructors/index', { instructors })
    
            })
        }

        
       
    },
    create(req,res){
        return res.render('instructors/create');
    },
    store(req,res){ 
        const keys = Object.keys(req.body)
    
        for( key of keys){
            if( req.body[key] == "" ){
                return res.send({ message: "Please fill all fields" })
            }
        }

        Instructor.create(req,function(instructor){
            return res.redirect(`/instructors/${instructor.id}`)
        })
        
    },
    show(req,res) {
        const { id } = req.params

        Instructor.find(id,function(instructor){

            if(!instructor) return res.send({ message: 'Instructor Not Found' })

            const instructorFormated = {
                ...instructor,
                age: age(instructor.birth),
                services: instructor.services.split(","),
                created_at: new Intl.DateTimeFormat("pt-BR").format(instructor.created_at),
            }
            
            return res.render('instructors/show', { data: instructorFormated })
        })
        
    },
    edit(req,res) {
        const { id } = req.params

        Instructor.find(id,function(instructor){
    
            const instructorFormated = {
                ...instructor,
                birth: date(instructor.birth).iso
            }
            
            return res.render('instructors/edit', { instructor: instructorFormated })
        
        })
        
    },
    update(req,res) {
        const { id } = req.body

        Instructor.update(id,req,function(instructor){

            if(!instructor) return res.send({ message: 'Instructor Not Found' })

            return res.redirect(`/instructors/${instructor.id}`)
        })
    },
    destroy(req,res) {
        const { id } = req.body

        console.log('ID ',req.body);
    
       Instructor.destroy(id,function(){
            return res.redirect('/instructors')
       })

    }

}