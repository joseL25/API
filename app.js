import express from 'express';
import { writeFileSync, readFile, readFileSync } from 'fs';
import { join } from 'path';
// import {fileURLToPath} from 'url';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// guardando la funcion express en una variable app para manipularlo 
const app = express();
// usando el Router de express para crear subrutas
const userRouter = express.Router(); // este router es para los endpoints de los usuarios
const productRouter = express.Router(); // este router es para los endpoints de los productos
const indexRouter = express.Router(); // este router es para los endpoints del home

// ruta de la base de datos users.json
const filePath = join(process.cwd(), '/database/users.json');
// rutas de la base de datos products.json
const filePath2 = join(process.cwd(),'/database/products.json');

dotenv.config();

app.use(express.json());
app.use(express.static('public'));


// console.log('Ruta del archivo:', filePath);

indexRouter.use((req, res, next) => {
    console.log(`📦 Middleware → ${req.method} ${req.url}`);
    next(); // ¡Importante! next() continúa hacia la siguiente función o ruta.
});

// Aqui comienzan las Validaciones - Auth

// Aqui terminan las Validaciones - Auth

// Aqui comienza las rutas del API para usuarios
userRouter.get('/',(req,res)=>{// 
    try {
        let lectura = readFileSync(filePath,'utf8')
        let data = JSON.parse(lectura)
        console.log('lectura: ',data);
        res.json(data);
    } catch (error) {
        console.log(error)
    }
})

// ruta API para cada usuario en el que el id de la ruta 
userRouter.get('/user-detail/:id',(req,res)=>{
    let id = req.params.id;
    let lectura = readFileSync(filePath,'utf8')
    let data = JSON.parse(lectura)
    let usuario = data.find(u=>u.id==id)
    if(!usuario){
        return res.status(404).json({mensaje:'usuario no encontrado'})
    }else{
        console.log('lectura: ',usuario);
        res.json(usuario);
    }
})

// ruta API para inisiar sesion
userRouter.post('/login',(req,res)=>{
    const SECRET_KEY = process.env.CLAVE_TOKEN;
    let {email,name} = req.body;
    // let password = req.body.password;
    let lectura = readFileSync(filePath,'utf8');
    let data = JSON.parse(lectura);
    let usuario = data.find(u=>u.email == email);
    if(!usuario){
        return res.status(404).json({mensaje:'este correo no esta registrado'})
    }else if(usuario.email == email && usuario.name == name){
        // Generar token
        // const token = jwt.sign({name:usuario.name,email:usuario.email}, SECRET_KEY, { expiresIn: "1h" });
        const token = jwt.sign(usuario, SECRET_KEY, { expiresIn: "1h" });
        res.json({mensaje:'sesion iniciada correctamente', user: usuario, key: token})
    }
});

// ruta API para cerrar sesion
userRouter.post('/logout',(req,res)=>{})

// ruta API para crear un usuario
userRouter.post('/create',(req,res)=>{
    let lectura = readFileSync(filePath,'utf8');
    let data = JSON.parse(lectura);
    let newUser = {
        id: data.length+1,
        name: req.body.name,
        email: req.body.email,
    }
    data.push(newUser);
    writeFileSync(filePath,JSON.stringify(data,null,2))
    res.json({mensaje:'usuario creado correctamente',user: newUser});
})

// ruta API para editar un usuario
userRouter.put('/edit/:id',(req,res)=>{
    let id = req.params.id;
    let lectura = readFileSync(filePath,'utf8');
    let data = JSON.parse(lectura);
    let usuario = data.find(u=>u.id==id)
    console.log(usuario);
    if(!usuario){
        return res.status(404).json({mensaje:'Ususario no encontrado'});
    }

    let {name,email} = req.body;
    if(name){usuario.name = name}
    if(email){usuario.email = email}
    let usuarioM = data.find(p=>p.id ==id)
    writeFileSync(filePath, JSON.stringify(data,null,2))
    res.json({mensaje:'usuario editado correctamente', user: usuarioM});
});

// ruta para eliminar el usuario
userRouter.delete('/delete/:id',(req,res)=>{
    let id = req.params.id;
    let lectura = readFileSync(filePath,'utf8');
    let data = JSON.parse(lectura)
    let buscador = data.find(u=> u.id ==id);
    if (!buscador) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    let filtro = data.filter(a=>a.id != id)
    writeFileSync(filePath,JSON.stringify(filtro,null,2))
    res.json({mensaje:'usuario eliminado correctamente'})
})
// Aqui termina las rutas del API para los usuarios


// AQUÍ COMIENZA LAS RUTAS API PARA LOS PRODUCTOS
// ruta API que devuelve todos los productos que estan products.json
productRouter.get('/',(req,res)=>{
    try {
        let lectura = readFileSync(filePath2,'utf8');
        let data = JSON.parse(lectura);
        console.log('lectura: ',data);
        res.json(data);
    } catch (error) {
        console.log(error)
    }
});

// ruta API que devuelve el json de un producto en especifico mediante su id
productRouter.get('/product-detail/:id',(req,res)=>{
    let {id} = req.params;
    let lectura = readFileSync(filePath2,'utf8');
    let data = JSON.parse(lectura);
    let producto = data.find(a=>a.id == id);
    if(!producto){
        return res.status(404).json({mensaje:'producto no encontrado'})
    }else{
        res.json({mensaje:'producto encontrado',product: producto});
    }
})

// AQUÍ TERMINA LAS API PARA LOS PRODUCTOS

app.use('/', indexRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);

// 8️⃣ Iniciamos el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor Express corriendo en http://localhost:${PORT}`);
});