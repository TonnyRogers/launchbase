const User = require('../models/User')
const { formatCep, formatCpfCnpj } = require('../../lib/utils')

module.exports = {
    create(req,res){
        return res.render("user/register.njk")
    },
    async store(req,res){

        const userId = await User.create(req.body)

        req.session.userId = userId

        return res.redirect('/users')
        
    },
    async show(req,res){

        const { user } = req

        user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
        user.cep = formatCep(user.cep)

        return res.render('user/index', { user })
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

            await User.delete(id)

            req.session.destroy()

            return res.render('session/login',{
                success: "Conta deletada!",
            })
            
        } catch (error) {
            console.error(error)

            return res.render('user/index',{
                error: "Não foi possivel deletar conta", 
                user: req.body
            })
        }
    }
}