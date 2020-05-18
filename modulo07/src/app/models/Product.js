const db = require('../../config/db')
const File = require('./File')

const Base = require('./Base')

Base.init({ table: 'products' })

module.exports = {
    ...Base,
    async search(params){
        const { filter, category } = params

        let query = '',
            filterQuery = `WHERE`

        filterQuery = `
            ${filterQuery} ( products.name ILIKE '%${filter}%'
            OR products.description ILIKE '%${filter}%' )
        `

        if(category){
            filterQuery += `
            AND products.category_id = ${category}
            `
        }

        query = `
            SELECT 
            products.*,
            categories.name AS category_name
            FROM products
            LEFT JOIN categories ON (categories.id = products.category_id)
            ${filterQuery}
        `

        const results = await db.query(query)
        return results.rows
    },
    async files(id) {
        const results = await db.query(`SELECT * FROM files WHERE product_id = $1`, [id])
        return results.rows
    },
    allFromUser(userId){
        return db.query(`SELECT * FROM products WHERE user_id = $1`, [userId])    
    },
    async delete(id) {

        const files = await File.findAll({ where: { product_id: id } })
        
        const filePromise = files.map( file => File.delete(file.id) )
        
        await Promise.all(filePromise)

        return db.query(`DELETE FROM products WHERE id = $1`,[id])
    }
}

// all(){
//     return db.query(`
//         SELECT * FROM products
//         ORDER BY updated_at DESC
//     `)
// },
// create(data){
//     const query = `
//         INSERT INTO products (
//             category_id,
//             user_id,
//             name,
//             description,
//             old_price,
//             price,
//             quantity,
//             status
//         ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8)
//         RETURNING id            
//     `
    
//     data.price = data.price.replace(/\D/g,"")

//     const values = [
//         data.category_id,
//         data.user_id,
//         data.name,
//         data.description,
//         data.old_price || data.price,
//         data.price,
//         data.quantity,
//         data.status || 1
//     ]

//     return db.query(query,values)

// }