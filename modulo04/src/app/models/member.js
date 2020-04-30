const db = require('../../config/db')
const { age, date } = require('../../lib/utils')

module.exports = {
    all(callback){
        db.query('SELECT * FROM members', function(err,result){
            if(err) throw `Database Error! ${err}`

            return callback(result.rows)
        })
    },
    create(req, callback){

        let { 
                avatar_url, 
                name, 
                email, 
                gender, 
                birth, 
                blood,
                weight, 
                height, 
                instructor_id 
            } = req.body 

        const query = `
            INSERT INTO members (
                avatar_url,
                name,
                email,
                birth,
                gender,
                blood,
                weight,
                height,
                instructor_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
            `

        const values = [
            avatar_url,
            name,
            email,
            date(birth).iso,
            gender,
            blood,
            weight,
            height,
            instructor_id
        ]

        db.query(query, values, function(err, result){
            if(err) throw `Database Error! ${err}`

            callback(result.rows[0])
        })

    },
    find(id, callback){
        db.query(`
            SELECT members.*, instructors.name as instructor_name
            FROM members 
            LEFT JOIN instructors ON (members.instructor_id = instructors.id)
            WHERE members.id = $1`,[id] , function(err, result){
            if(err) throw `Database Error! ${err}`
            
            callback(result.rows[0])
        })
    },
    update(id,req,callback){

        let { avatar_url, name, email, gender, birth, blood,weight, height, instructor_id } = req.body 

        const query = `
            UPDATE members
            SET
            avatar_url = ($1),
            name =($2),
            email =($3),
            birth =($4),
            gender =($5),
            blood =($6),
            weight =($7),
            height =($8),
            instructor_id =($9)
            WHERE id = $10
            RETURNING *
        `

        const values = [
            avatar_url,
            name,
            email,
            date(birth).iso,
            gender,
            blood,
            weight,
            height,
            instructor_id,
            id
        ]

        db.query(query,values,function(err, result){
            if(err) throw `Database Error! ${err}`
            
            callback(result.rows[0])
        })
    },
    destroy(id,callback){
        db.query('DELETE FROM members WHERE id = $1', [id], function(err,result){
            if(err) throw `Database Error! ${err}`

            return callback()
        })
    },
    instructorsSelectOptions(callback){
        db.query('SELECT name,id FROM instructors ORDER BY name', function(err,result){
            if(err) throw `Database Error! ${err} `

            callback(result.rows)
        })
    }
}