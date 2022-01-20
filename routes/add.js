const {Router} = require('express')
const Product = require('../models/product')
const router = Router()
const auth = require('../middleware/auth')

router.get('/', auth, (req, res) => {
    res.render('add', {
        title: "Add Product",
        isAdd: true
    })
})

router.post('/', auth, async (req,res) => {
    console.log(req.body)
    // const product = new Product(req.body.title, req.body.price, req.body.img)

    const product = new Product ({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    })

    try{
        await product.save()
        res.redirect('/products')
    } catch (e){
        console.log(e)
    }

    // res.redirect('/products')
})

module.exports = router