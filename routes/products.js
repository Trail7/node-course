const {Router} = require('express')
const Product = require('../models/product')
const router = Router()
const auth = require('../middleware/auth')


router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
            //lesson 43
            .populate('userId', 'email name')
            .select('price title img')

        console.log(products)
        res.render('products', {
            title: "Products",
            isProducts: true,
            userId: req.user ? req.user._id.toString() : null,
            products
        })
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }
    try {
        const product = await Product.findById(req.params.id)

        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/products')
        }
        res.render('product-edit', {
            title: `Edit ${product.title}`,
            product
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/edit', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/products')
        }
        const {id} = req.body
        delete req.body.id
        await Product.findByIdAndUpdate(id, req.body)
        res.redirect('/products')
    } catch (e) {
        console.log(e)
    }

})

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.render('product', {
        layout: 'empty',
        title: `product ${product.title}`,
        product
    })
})

router.post('/remove', auth, async (req, res) => {

    try {
        await Product.deleteOne({_id: req.body.id})
        res.redirect('/products')
    } catch (e) {
        console.log(e)
    }

})

module.exports = router