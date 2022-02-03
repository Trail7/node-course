const {Router} = require('express')
const Product = require('../models/product')
const router = Router()
const auth = require('../middleware/auth')
const {validationResult} = require('express-validator')
const {productValidators} = require('../utils/validators')

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: "Add Product",
        isAdd: true
    })
})

router.post('/', auth, productValidators, async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(422).render('add', {
            title: "Add Product",
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img,
            }
        })
    }

    const product = new Product({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    })

    try {
        await product.save()
        res.redirect('/products')
    } catch (e) {
        console.log(e)
    }

    // res.redirect('/products')
})

module.exports = router