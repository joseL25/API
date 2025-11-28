const { writeFileSync,readFileSync } = require('fs');
const { join } = require('path');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {} = require('../middlewares/auth.js')
require('dotenv').config;

// ruta de la base de datos users.json
const filePath = join(process.cwd(), './database/users.json');

module.exports = {
    allUsers:(req,res)=>{// 
        try {
            let lectura = readFileSync(filePath,'utf8');
            let data = JSON.parse(lectura);
            // console.log('lectura: ',data);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    },
    detail:(req,res)=>{
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
    },
    login:async(req,res)=>{
        try {
            const SECRET_KEY = process.env.CLAVE_TOKEN;
            let {email,password} = req.body;
            // let password = req.body.password;
            let lectura = readFileSync(filePath,'utf8');
            let data = JSON.parse(lectura);
            let usuario = data.find(u=>u.email == email);
            if(!usuario){
                return res.status(404).json({mensaje:'este correo no esta registrado'})
            }
            const passValidation = await bcryptjs.compare(password,usuario.password)
            if(usuario.email == email && passValidation){
                let payload ={name:usuario.name,email: usuario.email}
                const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // Generar token
                res.json({mensaje:'sesion iniciada correctamente', user: usuario, key: token})
            }
        } catch (error) {
            console.log(error);
        }
    },
    logout:(req,res)=>{
        res.json({mensaje:'sesion cerrada correctamente'})
    },
    upload:(req,res)=>{
        let lectura = readFileSync(filePath,'utf8');
        let data = JSON.parse(lectura);
        let newUser = {
            id: data.length+1,
            name: req.body.name,
            email: req.body.email,
            password: bcryptjs.hashSync(req.body.password, 5),
        }
        data.push(newUser);
        writeFileSync(filePath,JSON.stringify(data,null,2))
        res.json({mensaje:'usuario creado correctamente',user: newUser});
    },
    update:(req,res)=>{
        let id = req.params.id;
        let {name,email} = req.body;
        let lectura = readFileSync(filePath,'utf8');
        let data = JSON.parse(lectura);
        let usuario = data.find(u=>u.id==id)
        console.log(usuario);
        if(!usuario){
            return res.status(404).json({mensaje:'Ususario no encontrado'});
        }
        if(name){usuario.name = name}
        if(email){usuario.email = email}
        let usuarioM = data.find(p=>p.id ==id)
        writeFileSync(filePath, JSON.stringify(data,null,2))
        res.json({mensaje:'usuario editado correctamente', user: usuarioM});
    },
    remove:(req,res)=>{
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
    }
}