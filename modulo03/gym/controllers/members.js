const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils')

exports.index = function(req,res){
    return res.render('members/index', { members: data.members } );
}

exports.create = function(req,res){
    return res.render('members/create');
}

exports.store = function (req,res){ 
    const keys = Object.keys(req.body)

    for( key of keys){
        if( req.body[key] == "" ){
            return res.send("Please fill all fields")
        }
    }

    birth = Date.parse(req.body.birth)

    const lastMember = data.members[data.members.length - 1]

    let id = lastMember ? lastMember.id + 1 : 1

    data.members.push({
        id,
        ...req.body,
        birth,
    })

    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
    
    return res.redirect(`/members`)
}

exports.show = function (req,res) {
    const { id } = req.params
    const memberFind = data.members.find( item => item.id == id )
    
    if( !memberFind ) return res.send({ message: 'Member not found' })

    let isPositive = memberFind.blood.slice(-1);
    
    const member = {
        ...memberFind,
        age: age(memberFind.birth),
        birth: date(memberFind.birth).birthDay,
        blood: isPositive == '1' ? memberFind.blood.replace(isPositive,'+') : memberFind.blood.replace(isPositive,'-')
    }


    return res.render('members/show', { data: member })
}

exports.edit = function (req,res) {
    const { id } = req.params
    const memberFind = data.members.find( item => item.id == id )

    if( !memberFind ) return res.send({ message: 'Member not found' })

    const member = {
        ...memberFind,
        birth: date(memberFind.birth).iso
    }
    
    res.render('members/edit', { member })
}

exports.update = function (req,res) {
    const { id } = req.body
    let index = 0 

    let memberFind = data.members.find( (item,foundIndex) => {
        index = foundIndex
        return item.id == id 
    })

    if( !memberFind ) return res.send({ message: 'Member not found' })

    const member = {
        ...memberFind,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member;

    return res.redirect(`/members/${id}`)
}

exports.destroy = function (req,res) {
    const { id } = req.body
    let index = 0
    const memberFind = data.members.filter( (item,i) => {
        index = i
        return item.id == id 
    })

    if( !memberFind ) return res.send({ message: 'Member not found' })

    try {
        console.log('Index', index)
        data.members.splice(index,1)

        fs.writeFileSync("data.json", JSON.stringify(data,null,2))

        res.redirect('/members')
    } catch (error) {
        res.send({message: error })
    }
    

    
}