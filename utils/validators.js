const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body("email")
        .isEmail().withMessage('not email')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value})
                if (user) {
                    return Promise.reject('Email is already taken')
                }
            } catch (e) {
                console.log(e)
            }
        })
        .normalizeEmail(),
    body('password', 'min password length is 6')
        .isLength({min: 6, max: 20})
        .isAlphanumeric()
        .trim(),
    body('confirm')
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("passwords don't match")
            }
            return true
        })
        .trim(),
    body('name', 'Name min length is 5')
        .isLength({min: 5})
        .trim()
]

exports.productValidators = [
    body('title').isLength({min:3}).withMessage('min length is 3 chars').trim(),
    body('price').isNumeric().withMessage('Price is not a number'),
 body('img', 'url is not valid').isURL()
]
