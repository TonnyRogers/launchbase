const LoadProductService = require('../services/LoadProductService')
const LoadOrderService = require('../services/LoadOrderService')
const User = require('../models/User')
const Order = require('../models/Order')

const mailer = require('../../lib/mailer')
const Cart = require('../../lib/cart')

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
    async index(req,res){
        let orders = await LoadOrderService.load('orders', { where: { buyer_id: req.session.userId } })

        return res.render('order/index', { orders })
    },
    async sales(req,res){
        let sales = await LoadOrderService.load('orders', { where: { seller_id: req.session.userId } })

        return res.render('order/sales', { sales })
    },
    async store(req,res) {
        try {

            const cart = Cart.init(req.session.cart)

            const buyer_id = req.session.userId

            const filteredItems = cart.items.filter( item => 
                item.product.user_id != buyer_id    
            )

            const createOrderPromise = filteredItems.map( async item => {
                let { product, price: total, quantity } = item
                const { price, id: product_id, user_id: seller_id } = product
                const status = "open"

                const order = await Order.create({
                    seller_id,
                    buyer_id,
                    product_id,
                    price,
                    quantity,
                    total,
                    status
                })


                product = await LoadProductService.load('product', { where: {
                    id: product_id
                }})

                const seller = await User.findOne({ where: { id: seller_id }})

                const buyer = await User.findOne({ where: { id: buyer_id }})

                await mailer.sendMail({
                    to: seller.email,
                    from: 'no-reply@tonystore.com.br',
                    subject: 'Novo pedido de compra',
                    html: email(seller,product,buyer)
                })

                return order

            })


            await Promise.all(createOrderPromise)

            req.session.cart = Cart.init()

            return res.render('order/success')
            
        } catch (error) {
            console.error(error)
            return res.render('order/error')
        }
    },
    async show(req,res){
        const order = await LoadOrderService.load('order',{ where: { id: req.params.id } })

        return res.render('order/details', { order })
    }
}