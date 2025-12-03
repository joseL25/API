const { writeFileSync,readFileSync } = require('fs');
const { join } = require('path');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// ruta de la base de datos users.json
const filePath = join(process.cwd(), './database/users.json');

module.exports = {
    allUsers:(req,res)=>{// 
        try {
            let lectura = readFileSync(filePath,'utf8');
            let data = JSON.parse(lectura);
            data = data.map(({password,...rest})=> rest);
            res.json(data);
        } catch (error) {
            console.log(error);
        }
    },
    detail:(req,res)=>{
        let id = req.params.id;
        let lectura = readFileSync(filePath,'utf8');
        let data = JSON.parse(lectura);
        let usuario = data.find(u=>u.id==id);
        if(!usuario){
            return res.status(404).json({mensaje:'usuario no encontrado'});
        }else{
            // console.log('lectura: ',usuario);
            const {password, ...usuarioSpass} = usuario 
            res.json(usuarioSpass);
        }
    },
    login:async(req,res)=>{
        try {
            const SECRET_KEY = process.env.CLAVE_TOKEN;
            let {email,password} = req.body;
            let lectura = readFileSync(filePath,'utf8');
            let data = JSON.parse(lectura);
            let usuario = data.find(u=>u.email == email);

            if(!usuario){
                return res.status(404).json({mensaje:'este correo no esta registrado'});
            }

            const passValidation = await bcryptjs.compare(password,usuario.password);

            if(!passValidation){return res.status(404).json({mensaje:'contraseña incorrecta'})};

            if(usuario.email == email && passValidation){
                let payload ={id:usuario.id,name:usuario.name,email: usuario.email}
                const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // Generar token
                const {password, ...usuarioSpass} = usuario;
                res.cookie('token', token, {
                httpOnly: true,       // solo accesible desde el servidor
                secure: false,        // true si usas HTTPS
                maxAge: 1000 * 60 * 60 * 24}); // duracion de un día
                res.json({mensaje:'sesion iniciada correctamente', user: usuarioSpass, key: token});
            }
        } catch (error) {
            console.log(error);
        };
    },
    logout:(_req,res)=>{
        res.clearCookie('token');
        res.json({mensaje:'sesion cerrada'});
    },
    upload:(req,res)=>{
        let lectura = readFileSync(filePath,'utf8');
        let data = JSON.parse(lectura);
        let newUser = {
            id: data.length+1,
            name: req.body.name,
            email: req.body.email,
            password: bcryptjs.hashSync(req.body.password, 5),
            role: req.body.rol
        }
        data.push(newUser);
        const {password,...newSpass} = newUser;
        writeFileSync(filePath,JSON.stringify(data,null,2))
        res.json({mensaje:'usuario creado correctamente',user: newSpass});
    },
    register:(req,res)=>{
        let lectura = readFileSync(filePath,'utf8');
        let data = JSON.parse(lectura);
        let defaultUser = 'customer';
        let newUser = {
            id: data.length+1,
            name: req.body.name,
            email: req.body.email,
            password: bcryptjs.hashSync(req.body.password,5),
            role: defaultUser
        };
        data.push(newUser);
        let payload ={id:usuario.id,name:usuario.name,email: usuario.email}
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // Generar token
        const {password,...newSpass} = newUser;
        writeFileSync(filePath,JSON.stringify(data,null,2));
        res.json({mensaje:'usuario creado correctamente',user:newSpass, token:token});
    },
    update:(req,res)=>{
        let id = req.params.id;
        let {name,email} = req.body;
        let lectura = readFileSync(filePath,'utf8');
        let data = JSON.parse(lectura);
        let usuario = data.find(u=>u.id==id)
        if(!usuario){
            return res.status(404).json({mensaje:'Ususario no encontrado'});
        }
        if(name){usuario.name = name};
        if(email){usuario.email = email};
        let usuarioM = data.find(p=>p.id == id);
        const {password,...usuarioMSpass} = usuarioM;
        writeFileSync(filePath, JSON.stringify(data,null,2));
        res.json({mensaje:'usuario editado correctamente', user: usuarioMSpass});
    },
    remove:(req,res)=>{
        let id = req.params.id;
        let lectura = readFileSync(filePath,'utf8');
        let data = JSON.parse(lectura);
        let buscador = data.find(u=> u.id ==id);
        if (!buscador) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        };
        let filtro = data.filter(a=>a.id != id);
        writeFileSync(filePath,JSON.stringify(filtro,null,2));
        res.json({mensaje:'usuario eliminado correctamente'});
    }
};