const usersController = require('../controllers/usersController');
const passport = require('passport');


module.exports = (app, upload) =>{
    //GET -> para obtener datos
    //POST -> almacenar datos
    //PUT -> actualizar datos
    //DELETE -> eliminar datos

    app.get('/api/users/findDeliveryMen', passport.authenticate('jwt', { session: false }), usersController.findDeliveryMen);

    app.post('/api/users/login',usersController.login);
    app.post('/api/users/create',usersController.register);
    app.post('/api/users/createWithImage', upload.array('image', 1), usersController.registerWithImage);

}