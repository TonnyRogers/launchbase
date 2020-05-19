const fs = require('fs')

const User = require('../models/User')
const Product = require('../models/Product')

const { formatCep, formatCpfCnpj } = require('../../lib/utils')
const LoadProductService = require('../services/LoadProductService')

module.exports = {
    create(req,res){
        return res.render("user/register.njk")
    },
    async store(req,res){

        try {
            let { name, email, password , cpf_cnpj, cep, address } = req.body

            cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
            cep = cep.replace(/\D/g,"")

            const userId = await User.create({
                name,
                email,
                password,
                cpf_cnpj,
                cep,
                address
            })

            req.session.userId = userId

            return res.redirect('/users')
        } catch (error) {
            console.error(error)
        }        
    },
    async show(req,res){

        try {
            const { user } = req

            user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
            user.cep = formatCep(user.cep)

            return res.render('user/index', { user })
        } catch (error) {
            console.error(error)
        }
        
    },
    async update(req,res){
        try {
            
            const { user } = req
            let { name, email, cpf_cnpj, cep, address } = req.body
            
            cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
            cep = cep.replace(/\D/g,"")

            await User.update(user.id,{
                name,
                email,
                cpf_cnpj,
                cep,
                address
            })

            return res.render('user/index', {
                user: req.body,
                success: "Conta atualizada "
            })



        } catch (error) {
            
            console.error(error)

            res.render('user/index',{
                error: "Aconteceu algum erro! "
            })
        }
    },
    async destroy(req,res){

        try {

            const { id } = req.body

            let products  = await Product.findAll({where: { user_id: id }})

            const allFilesPromise = products.map( product => Product.files(product.id))
            let promiseResults = await Promise.all(allFilesPromise)

            await User.delete(id)
            req.session.destroy() 

            promiseResults.map(files => {
                try {
                    files.map( file => fs.unlinkSync(file.path))
                } catch (error) {
                    console.error(error);
                    
                }
            })

            return res.render('session/login',{
                success: "Conta deletada!",
            })
            
        } catch (error) {
            console.error(error)
        }
    },
    async ads(req,res) {
        const products = await LoadProductService.load('products',{
            where: { user_id: req.session.userId }
        })

        return res.render('user/ads', { products } )
    }

}