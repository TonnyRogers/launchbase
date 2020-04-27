const { age, date } = require('../../lib/utils')

module.exports = {
    index(req,res){
        return res.render('members/index', { members: data.members } );
    },
    create(req,res){
        return res.render('members/create');
    },
    store(req,res){ 
        // const keys = Object.keys(req.body)
    
        // for( key of keys){
        //     if( req.body[key] == "" ){
        //         return res.send("Please fill all fields")
        //     }
        // }
    
        // birth = Date.parse(req.body.birth)
    
        // const lastMember = data.members[data.members.length - 1]
    
        // let id = lastMember ? lastMember.id + 1 : 1
        
        return res.redirect(`/members`)
    },
    show(req,res) {
        // const { id } = req.params
       
        // let isPositive = memberFind.blood.slice(-1);
        
        // const member = {
        //     ...memberFind,
        //     age: age(memberFind.birth),
        //     birth: date(memberFind.birth).birthDay,
        //     blood: isPositive == '1' ? memberFind.blood.replace(isPositive,'+') : memberFind.blood.replace(isPositive,'-')
        // }
    
    
        return res.render('members/show')
    },
    edit(req,res) {
        // const { id } = req.params
    
        // const member = {
        //     ...memberFind,
        //     birth: date(memberFind.birth).iso
        // }
        
        return res.render('members/edit')
    },
    update(req,res) {
        // const { id } = req.body
        // let index = 0 
    
        // const member = {
        //     ...memberFind,
        //     ...req.body,
        //     birth: Date.parse(req.body.birth),
        //     id: Number(req.body.id)
        // }
    
        return res.redirect(`/members/${id}`)
    },
    destroy(req,res) {
        const { id } = req.body
    
        try {
    
            return res.redirect('/members')
        } catch (error) {
            return res.send({ message: error })
        }
        
    
        
    }


}