const db =  require('../../config/db')
const { age, date } = require('../../lib/utils')

module.exports = {
    all(callback){
        db.query(`
            SELECT instructors.*, count(members.*) AS total_students
            FROM instructors
            LEFT JOIN members ON (instructors.id = members.instructor_id)
            GROUP BY instructors.id
            ORDER BY name ASC
            `, function(err, result){
            if(err) throw `Database Error! ${err}`
            
            callback(result.rows)
        })
    },
    create(req, callback){

        let { avatar_url, name, services, gender, birth } = req.body 

        const query = `
            INSERT INTO instructors (
                avatar_url,
                name,
                birth,
                gender,
                services,
                created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
            `

        const values = [
            avatar_url,
            name,
            date(birth).iso,
            gender,
            services,
            date(Date.now()).iso
        ]

        db.query(query, values, function(err, result){
            if(err) throw `Database Error! ${err}`

            callback(result.rows[0])
        })

    },
    find(id, callback){
        db.query(`SELECT * FROM instructors WHERE id = $1`,[id] , function(err, result){
            if(err) throw `Database Error! ${err}`
            
            callback(result.rows[0])
        })
    },
    update(id,req,callback){

        let { avatar_url, name, services, gender, birth } = req.body 

        const query = `
            UPDATE instructors
            SET
            avatar_url =($1),
            name =($2),
            birth =($3),
            gender =($4),
            services =($5)
            WHERE id = $6
            RETURNING *
        `

        const values = [
            avatar_url,
            name,
            date(birth).iso,
            gender,
            services,
            id
        ]

        db.query(query,values,function(err, result){
            if(err) throw `Database Error! ${err}`
            console.log("ERROR: ", err)
            console.log("RETURN: ", result)
            
            callback(result.rows[0])
        })
    },
    destroy(id,callback){
        db.query('DELETE FROM instructors WHERE id = $1', [id], function(err,result){
            if(err) throw `Database Error! ${err}`

            return callback()
        })
    },
    findBy(filter, callback){
        db.query(`
            SELECT instructors.*, count(members.*) AS total_students
            FROM instructors
            LEFT JOIN members ON (instructors.id = members.instructor_id)
            WHERE instructors.name ILIKE '%${filter}%' OR
            instructors.services ILIKE '%${filter}%'
            GROUP BY instructors.id
            ORDER BY name ASC`,function(err, result){
            if(err) throw `Database Error! ${err}`
            
            callback(result.rows)
        })
    },

}