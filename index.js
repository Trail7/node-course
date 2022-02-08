const express = require('express')
const path = require('path')
const csrf = require('csurf')
const flash = require('connect-flash')
const Handlebars = require('handlebars')
const compression = require('compression')
const helmet = require('helmet')
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
const profileRoutes = require('./routes/profile')
const mongoose = require('mongoose')
const varMiddleware = require ('./middleware/variables')
const userMiddleware = require ('./middleware/user')
const errorHandler = require ('./middleware/error')
const fileMiddleware = require('./middleware/file')
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
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(helmet({contentSecurityPolicy: false, }))
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/products', productRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use(errorHandler)


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



