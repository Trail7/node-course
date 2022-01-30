const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const Handlebars = require('handlebars')
const {engine} = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const productRoutes = require('./routes/products')
const cardRoutes = require('./routes/card')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const mongoose = require('mongoose')
const varMiddleware = require ('./middleware/variables')
const userMiddleware = require ('./middleware/user')
const keys = require ('./keys')

const app = express()
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})
app.engine('hbs', engine({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs-helpers')
}));
app.set('view engine', 'hbs');
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/products', productRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)


const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()



