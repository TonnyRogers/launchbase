const { age, date } = require('../../lib/utils')
const Member = require('../models/member')

module.exports = {
    index(req,res){
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        offset = limit * (page - 1)

        let params = {
            filter,
            page,
            limit,
            offset,
            callback(members){
                const pagination = {
                    total: Math.ceil(members[0].total / 2),
                    page
                }
                return res.render('members/index', { members, pagination, filter })
            } 
        }

        Member.paginate(params)
        
    },
    create(req,res){
        Member.instructorsSelectOptions(function(instructorList){
            return res.render('members/create', { instructors: instructorList });
        })
        
    },
    store(req,res){ 

        const keys = Object.keys(req.body)
    
        for( key of keys){
            if( req.body[key] == "" ){
                return res.send("Please fill all fields")
            }
        }

        Member.create(req,function(member){
            return res.redirect(`/members/${member.id}`)
        })
        
    },
    show(req,res) {
        const { id } = req.params

        Member.find(id, function(member){

            let isPositive = member.blood.slice(-1);
        
            member = {
                ...member,
                age: age(member.birth),
                birth: date(member.birth).birthDay,
                blood: isPositive == '1' ? member.blood.replace(isPositive,'+') : member.blood.replace(isPositive,'-')
            }

            return res.render('members/show', { data: member })
        })
       
    },
    edit(req,res) {
        const { id } = req.params
        let instructors = []

        Member.instructorsSelectOptions(function(instructorList){
            instructors = instructorList
            return
        })

        Member.find(id, function(member){

            let isPositive = member.blood.slice(-1);
        
            member = {
                ...member,
                birth: date(member.birth).iso,
            }

            return res.render('members/edit', { member, instructors })
        })
        
    },
    update(req,res) {
        const { id } = req.body

        Member.update(id,req,function(member){
            return res.redirect(`/members/${member.id}`)
        })
        
    },
    destroy(req,res) {
        const { id } = req.body

        Member.destroy(id,function(){
            return res.redirect('/members')
        })   
        
    }


}