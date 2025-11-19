import express from 'express';
import { writeFileSync, readFile, readFileSync } from 'fs';
import { join } from 'path';

const app = express();
const userRouter = express.Router();
app.use(express.json());

// const users = [
//     { id: 1, name: 'Ana', },
//     { id: 2, name: 'Luis', },
//     { id: 3, name: 'Carla', },
//   ];

const filePath = join(process.cwd(), '/database/users.json');
// console.log('Ruta del archivo:', filePath);

// writeFileSync(filePath, JSON.stringify(users,null,2))
// let lectura = readFile(filePath,'utf-8',(err,data)=>{
    // if(err){
        // console.log(`error presentado: ${err}`);
        // return;
    // }
    // const jsonobjeto = JSON.parse(data);
    // return data;
    // console.log(data)
// })

// userRouter.use((req, res, next) => {
//   console.log(`📦 Middleware → ${req.method} ${req.url}`);
//   next(); // ¡Importante! next() continúa hacia la siguiente función o ruta.
// });
app.use((req, res, next) => {
  console.log(`📦 Middleware → ${req.method} ${req.url}`);
  next(); // ¡Importante! next() continúa hacia la siguiente función o ruta.
});

userRouter.get('/',(re,res)=>{
    res.send('Bienvenido a la vista del Home')
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

app.use('/', userRouter);

// app.use('/users', userRouter);
// app.get('/users', (req, res) => {
//     try {
//         let lectura = readFileSync(filePath,'utf8')
//         let data = JSON.parse(lectura)
//         console.log('lectura: ',data);
//         res.json(data);
//     } catch (error) {
//         console.log(error)
//     }
// });


// 8️⃣ Iniciamos el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor Express corriendo en http://localhost:${PORT}`);
});