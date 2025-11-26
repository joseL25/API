const express = require('express');
const userRouter = express.Router(); // este router es para los endpoints de los usuarios

const {allUsers,
    detail,
    login,
    logout,
    upload,
    update,
    remove} = require('../controllers/users.API.controller.js');

// ruta API para que devuelva todos los usuarios
userRouter.get('/', allUsers)

// ruta API para cada usuario en el que el id de la ruta 
userRouter.get('/user-detail/:id',detail)

// ruta API para iniciar sesion
userRouter.post('/login', login);

// ruta API para cerrar sesion
userRouter.post('/logout', logout)

// ruta API para crear un usuario
userRouter.post('/create',upload)

// ruta API para editar un usuario
userRouter.put('/edit/:id',update);

// ruta para eliminar el usuario
userRouter.delete('/delete/:id', remove)

module.exports = userRouter;
