const {body} = require('express-validator')
const User = require('../models/user')

exports.registerValidators = [
    body("email").isEmail().withMessage('not email').custom(async (value, {req}) => {
        try{
            const user = await User.findOne({email: value})
            if (user){
                return Promise.reject('Email is already taken')
            }
        }catch(e){
            console.log(e)
        }
    }),
    body('password', 'min password length is 6').isLength({min: 6, max: 20}).isAlphanumeric(),
    body('confirm').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("passwords don't match")
        }
        return true
    }),
    body('name', 'Name min length is 3').isLength({min: 5})
]