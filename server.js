require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('Conectei a base de dados')
        app.emit('pronto');
    })
    .catch(e => console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf')
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

// /profiles/12345?campanha=googleads
app.use(helmet())
app.use(helmet.referrerPolicy({policy: ["origin", "unsafe-url"]}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')))

const sessionOptions = session({
    secret: 'uhuidafuaferi93i934dnns0213',
    //store: new MongoStore({ mongooseConnection: mongoose.connection}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 24 * 7,
        httpOnly: true
    },
    store: MongoStore.create({ mongoUrl:process.env.CONNECTIONSTRING })
})

app.use(sessionOptions);
app.use(flash());


app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(csrf());
//nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes)

app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Acessa http://localhost:3000');
        console.log('Servidor executando na porta 3000');
    });
})