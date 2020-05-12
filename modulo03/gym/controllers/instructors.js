const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils')

exports.index = function(req,res){
    return res.render('instructors/index', { instructors: data.instructors } );
}

exports.create = function(req,res){
    return res.render('instructors/create');
}

exports.store = function (req,res){ 
    const keys = Object.keys(req.body)

    for( key of keys){
        if( req.body[key] == "" ){
            return res.send("Please fill all fields")
        }
    }

    let { avatar_url, name, services, gender, birth } = req.body 

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.instructors.length + 1)

    data.instructors.push({
        id,
        avatar_url,
        birth,
        name,
        services,
        gender,
        created_at
    })

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
        if (err) return console.log(err);

        return res.redirect(`/instructors/${id}`)
    });
    
}

exports.show = function (req,res) {
    const { id } = req.params
    const instructorFind = data.instructors.find( item => item.id == id )
    
    if( !instructorFind ) return res.send({ message: 'Instructor not found' })
    
    const instructor = {
        ...instructorFind,
        age: age(instructorFind.birth),
        services: instructorFind.services.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(instructorFind.created_at),
    }


    return res.render('instructors/show', { data: instructor })
}

exports.edit = function (req,res) {
    const { id } = req.params
    const instructorFind = data.instructors.find( item => item.id == id )

    if( !instructorFind ) return res.send({ message: 'Instructor not found' })

    const instructor = {
        ...instructorFind,
        birth: date(instructorFind.birth).iso
    }
    
    res.render('instructors/edit', { instructor })
}

exports.update = function (req,res) {
    const { id } = req.body
    let index = 0 

    let instructorFind = data.instructors.find( (item,foundIndex) => {
        index = foundIndex
        return item.id == id 
    })

    if( !instructorFind ) return res.send({ message: 'Instructor not found' })

    const instructor = {
        ...instructorFind,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor;

    return res.redirect(`../instructors/${id}`)
}

exports.destroy = function (req,res) {
    const { id } = req.body
    let index = 0
    const instructorFind = data.instructors.filter( (item,i) => {
        index = i
        return item.id == id 
    })

    if( !instructorFind ) return res.send({ message: 'Instructor not found' })

    try {
        console.log('Index', index)
        data.instructors.splice(index,1)

        fs.writeFileSync("data.json", JSON.stringify(data,null,2))

        res.send({message: 'Instructor deleted '})
    } catch (error) {
        res.send({message: error })
    }
    

    
}