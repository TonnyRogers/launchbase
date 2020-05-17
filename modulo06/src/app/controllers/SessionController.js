const User = require('../models/User')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')

module.exports = {
    loginForm(req,res) {
        return res.render('session/login')
    },
    login(req, res){
        req.session.userId = req.user.id

        return res.redirect('/users')
    },
    logout(req, res){
        req.session.destroy()
        return res.redirect('/login')
    },
    forgotForm(req,res){
        return res.render('session/forgot-password')
    },
    async forgot(req,res){

        try {
            const user = req.user

            const token = crypto.randomBytes(20).toString("hex")

            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Recuperação de Senha',
                html: `
                    <h2>Esqueceu sua senha?</h2>
                    <p>Clique no link abaixo para recupera-la.</p>
                    <p>
                        <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
                            Recuperar Senha
                        </a>
                    </p>
                `
            })


            return res.render('session/forgot-password', {
                success: "Solicitação enviada por e-mail"
            })
        } catch (error) {
            console.error(error)
            return res.render('session/forgot-password', {
                error: "Erro ao enviadar e-mail"
            })
        }
        

        
    },
    resetForm(req,res){
        return res.render('session/password-reset', { token: req.query.token })
    },
    async reset(req,res){
        try {

            const { user } = req

            const { password, token } = req.body 

            const newPassword = await hash(password,8)

            await User.update(user.id,{
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            })

            return res.render('session/login', {
                success: "Senha alterada",
                user: req.body
            })


            
        } catch (error) {
            console.error(error)
            return res.render('session/password-reset', {
                error: "Erro ao redefinir senha",
                user: req.body,
                token
            })
        }
    }
}