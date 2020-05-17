const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next){

    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if(!user) return res.render('session/login', { 
        error: "Usuário não encontrado!",
        user: req.body
    })

    const passed = await compare(password, user.password)

    if(!passed) return res.render('session/login', {
        error: 'Senha incorreta',
        user: req.body
    })

    req.user = user

    next()
}

async function forgot(req, res, next) {

    try {
        const { email } = req.body

        let user = await User.findOne({ where: { email } })

        if(!user) return res.render('session/forgot-password', {
                        error: "Nenhum usuário encontrado com este e-mail",
                        user: req.body
                    })

        req.user = user
        
        next()
    } catch (error) {
        console.error(error)

    }
}

async function reset(req, res, next){
    const { email, password, passwordRepeat, token } = req.body

    const user = await User.findOne({ where: { email } })

    if(!user) return res.render('session/password-reset', { 
        error: "Usuário não encontrado!",
        user: req.body,
        token
    })

    if(password !== passwordRepeat) return res.render('session/password-reset',{ 
        error: 'As senhas não coincidem!', 
        user: req.body,
        token
    })

    if(token != user.reset_token) return res.render('session/password-reset', { 
        error: "Token inválido, solicite recuperação novamente!",
        user: req.body,
        token
    })

    let now = new Date()
    now = now.setHours(now.getHours())
    if(now > user.reset_token_expires) return res.render('session/password-reset', { 
        error: "Token expirado, solicite recuperação novamente!",
        user: req.body,
        token
    })

    req.user = user

    next()
}

module.exports = {
    login,
    forgot,
    reset
}