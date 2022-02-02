const {body} = require('express-validator')


exports.registerValidators = [
    body("email").isEmail().withMessage('not email'),
    body('password', 'min password length is 6').isLength({min: 6, max: 20}).isAlphanumeric(),
    body('confirm').custom((value, {req})=>{
        if (value !==req.body.password){
            throw new Error ("passwords don't match")
        }
        return true
    }),
    body('name', 'Name min length is 3').isLength({min:5})
]