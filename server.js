const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const session = require('express-session'); // Agregar express-session
const Keys = require('./config/keys');

/*
* IMPORTAR RUTAS
*/ 
const usersRoutes = require('./routes/userRoutes');
const categoriesRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const addressRoutes = require('./routes/addressRoutes');
const ordersRoutes = require('./routes/orderRoutes');
const io = require('socket.io')(server);


const keys = require('./config/keys');

const port = process.env.PORT || 3000;

/*
* IMPORTAR SOCKETS
*/
const ordersSocket = require('./sockets/ordersSocket');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());
app.use(session({
    secret: keys.secretOrKey, // Cambia por una cadena secreta más segura
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

const upload = multer({
    storage: multer.memoryStorage()
});

/*
* LLAMADO A LOS SOCKETS
*/
ordersSocket(io);

/**
 * LLAMADO DE LAS RUTAS
 */
usersRoutes(app, upload);
categoriesRoutes(app);
addressRoutes(app);
productRoutes(app, upload);
ordersRoutes(app);


server.listen(3000, '192.168.0.121' || 'localhost', function(){
    console.log('Aplicacion de NodeJS ' + port + ' Iniciada.....')
});

app.get('/', (req, res) => {
    res.send('Ruta raiz del backend');
});

app.get('/test', (req, res) => {
    res.send('Esta es la ruta TEST');
});

//manejo de error
app.use((err, req, res, next) =>{
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

//200 - es una respuesta exitosa
//404 - significa que la URL no existe
//500 - error interno del servior
