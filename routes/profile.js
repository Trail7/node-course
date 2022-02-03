const {Router} = require('express')
const auth = require('../middleware/auth')
const keys = require('../keys')
const router = Router()

router.get('/', (req, res) => {
    res.render('profile', {
        title: 'Profile',
        isProfile: true,
        defaultImage: keys.DEFAULT_IMAGE,
        user: req.user.toObject()
    })
})

router.post('', (req, res) => {

})

module.exports = router