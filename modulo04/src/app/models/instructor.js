const db =  require('../../config/db')
const { age, date } = require('../../lib/utils')

module.exports = {
    all(callback){
        db.query(`SELECT * FROM instructors`, function(err, result){
            if(err) return res.send({ message: 'Database Error', error: err })
            
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
            if(err) return res.send({ message: 'Database Error', error: err })

            callback(result.rows[0])
        })

    },
    find(id, callback){
        db.query(`SELECT * FROM instructors WHERE id = $1`,[id] , function(err, result){
            if(err) return res.send({ message: 'Database Error', error: err })
            
            callback(result.rows[0])
        })
    },
    update(id,req,callback){

        let { avatar_url, name, services, gender, birth } = req.body 

        const query = `
            UPDATE instructors
            SET
            avatar_url = $1,
            name = $2,
            birth = $3,
            gender = $4,
            services = $5
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
            // if(err) return res.send({ message: 'Database Error', error: err })
            console.log("ERROR: ", err)
            console.log("RETURN: ", result)
            
            callback(result.rows[0])
        })
    }

}