const express = require('express');
const productRouter = express.Router(); // este router es para los endpoints de los productos

const {allProd,
    detail,
    uploadProd,
    updateProd,
    deleteProd} = require('../controllers/products.API.controller.js')

// ruta API que devuelve todos los productos que estan products.json
productRouter.get('/',allProd);

// ruta API que devuelve el json de un producto en especifico mediante su id
productRouter.get('/product-detail/:id',detail)

// ruta API que para crear un producto
productRouter.post('/create-product',uploadProd);

// ruta API para editar un producto
productRouter.put('/product-edit/:id',updateProd);

// ruta API para eliminar un producto
productRouter.delete('/delete/:id',deleteProd)

module.exports = productRouter;