// import jwt from 'jsonwebtoken';
const express = require('express');
const app = express();
const indexRouter = require('./routes/index.API.routes.js');
const userRouter = require('./routes/users.API.routes.js');
const productRouter = require('./routes/products.API.routes.js');
var cookieParser = require('cookie-parser')

require('dotenv').config();

app.use(express.json());
app.use(express.static('public'));

app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`📦 Middleware → ${req.method} ${req.url}`);
    next(); // ¡Importante! next() continúa hacia la siguiente función o ruta.
});

app.use('/', indexRouter); // aqui se abre las subrutas del home
app.use('/api/users', userRouter); // aqui se abre las subrutas de los usuarios
app.use('/api/products', productRouter); // aqui se abre las subrutas de los productos

// 8️⃣ Iniciamos el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor Express corriendo en http://localhost:${PORT}`);
});