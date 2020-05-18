const User = require('../models/User')
const { compare } = require('bcryptjs')


function checkAllFields(body){
    const keys = Object.keys(body)

    for(key of keys){
        if(body[key] == "" ){
            return {
                 error: 'Preencha todos os campos!', 
                 user: body 
            }
        }
    }
}

async function post(req, res, next){

    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields) return res.render('user/register', fillAllFields )

    let { email, cpf_cnpj, password, passwordRepeat } = req.body

    cpf_cnpj = cpf_cnpj.replace(/\D/g, "")

    const user = await User.findOne({
        where: {email},
        or: {cpf_cnpj}  
    })

    if(user) return res.render('user/register',{ 
        error: 'Usuário ja existe!', 
        user: req.body
    })

    if(password !== passwordRepeat) return res.render('user/register',{ 
        error: 'As senhas não coincidem!', 
        user: req.body
    })

    next()

}

async function show(req, res, next){

    const { userId: id } = req.session
    const user = await User.findOne({ where: { id } })

    if(!user) return res.render('user/register', { error: "Usuário não encontrado!" })

    req.user = user

    next()
}

async function update(req, res, next){
    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields) return res.render('user/index', fillAllFields )

    const { id , password } = req.body

    if(!password) return res.render('user/index', { 
        error: "Digite sua senha para atualizar",
        user: req.body
    })

    const user = await User.findOne({ where: { id } })

    const passed = await compare(password, user.password)

    if(!passed) return res.render('user/index', {
        error: 'Senha incorreta',
        user: req.body
    })

    req.user = user

    next()

}

module.exports = {
    checkAllFields,
    post,
    show,
    update
}