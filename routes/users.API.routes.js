const express = require('express');
const userRouter = express.Router(); // este router es para los endpoints de los usuarios
const authLogged = require('../middlewares/auth.js');

const {allUsers,
    detail,
    login,
    logout,
    upload,
    update,
    remove,
    register} = require('../controllers/users.API.controller.js');

// ruta API para que devuelva todos los usuarios
userRouter.get('/',authLogged,allUsers);

// ruta API para cada usuario en el que el id de la ruta 
userRouter.get('/user-detail/:id',authLogged,detail);

// ruta API para iniciar sesion
userRouter.post('/login', login);

// ruta API para cerrar sesion
userRouter.post('/logout',authLogged, logout);

// ruta API para crear un usuario desde el admin
userRouter.post('/create',authLogged,upload);

// ruta API para que el cliente se registre
userRouter.post('/register', register);

// ruta API para editar un usuario
userRouter.put('/edit/:id',authLogged,update);

// ruta para eliminar el usuario
userRouter.delete('/delete/:id',authLogged, remove);

module.exports = userRouter;
