import express from 'express';
import { writeFileSync, readFile, readFileSync } from 'fs';
import path,{ join } from 'path';
import {fileURLToPath} from 'url';
import jwt from 'jsonwebtoken';

// guardando la funcion express en una variable app para manipularlo 
const app = express();
// usando el Router de express para crear subrutas
const userRouter = express.Router();
// Convierte la URL del archivo en un path usable
const __filename = fileURLToPath(import.meta.url);
// Obtiene la carpeta del archivo actual
const __dirname = path.dirname(__filename);          

// ruta de la base de datos .json
const filePath = join(process.cwd(), '/database/users.json');

app.use(express.json());
app.use(express.static('public'));


// console.log('Ruta del archivo:', filePath);

userRouter.use((req, res, next) => {
    console.log(`📦 Middleware → ${req.method} ${req.url}`);
    next(); // ¡Importante! next() continúa hacia la siguiente función o ruta.
});

// Aqui comienza las rutas del API
userRouter.get('/',(re,res)=>{
    res.send('vista del home')
})

userRouter.get('/users',(req,res)=>{
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
userRouter.get('/users/:id',(req,res)=>{
    let id = req.params.id;
    let lectura = readFileSync(filePath,'utf8')
    let data = JSON.parse(lectura)
    let buscador = data.find(u=>u.id==id)
    if(!buscador){
        return res.status(404).json({mensaje:'usuario no encontrado'})
    }else{
        console.log('lectura: ',buscador);
        res.json(buscador);
    }
})

userRouter.post('/login',(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    let lectura = readFileSync(filePath,'utf8');
    let data = JSON.parse(lectura);
    let buscador = data.filter(u=>u.email == email);
});

// ruta para crear un usuario
userRouter.post('/users/create',(req,res)=>{
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

// ruta para eliminar el usuario
userRouter.delete('/users/delete/:id',(req,res)=>{
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
// Aqui termina las rutas del API


app.use('/', userRouter);

// 8️⃣ Iniciamos el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor Express corriendo en http://localhost:${PORT}`);
});