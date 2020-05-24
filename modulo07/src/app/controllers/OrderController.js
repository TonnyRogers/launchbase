const LoadProductService = require('../services/LoadProductService')
const User = require('../models/User')

const mailer = require('../../lib/mailer')

const email = (seller,product, buyer) => `
    <h2>Olá ${seller.name}</h2>
    <p>Vocẽ tem um novo pedido de produto</p>
    <p>Produdo: ${product.name}</p
    <p>Preço: ${product.formattedPrice}</p>
    <p><br><br></p>
    <h3>Dados do comprador</h3>
    <p>${buyer.name}</p>
    <p>${buyer.email}</p>
    <p>${buyer.address}</p>
    <p>${buyer.cep}</p>
    <p><br><br></p>
    <p><strong>Entre em contato com o comprador para finalizar a Venda</strong></p>
    <p><br><br></p>
    <p>Atenciosamente, equipe Tonystore</p>
`

module.exports = {
    async store(req,res) {
        try {

            console.log('body',req.body)

           const product = await LoadProductService.load('product', { where: {
               id: req.body.id
           }})

           console.log(product)

           const seller = await User.findOne({ where: { id: product.user_id }})

           const buyer = await User.findOne({ where: { id: req.session.userId }})

           await mailer.sendMail({
               to: seller.email,
               from: 'no-reply@tonystore.com.br',
               subject: 'Novo pedido de compra',
               html: email(seller,product,buyer)
           })


           return res.render('order/success')
            
        } catch (error) {
            console.error(error)
            return res.render('order/error')
        }
    }
}