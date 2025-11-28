const { writeFileSync,readFileSync } = require('fs');
const { join } = require('path');

// rutas de la base de datos products.json
const filePath2 = join(process.cwd(),'./database/products.json');

module.exports = {
    allProd:(req,res)=>{
        try {
            let lectura = readFileSync(filePath2,'utf8');
            let data = JSON.parse(lectura);
            // console.log('lectura: ',data);
            res.json(data);
        } catch (error) {
            console.log(error)
        }
    },
    detail:(req,res)=>{
        let {id} = req.params;
        let lectura = readFileSync(filePath2,'utf8');
        let data = JSON.parse(lectura);
        let producto = data.find(a=>a.id == id);
        if(!producto){
            return res.status(404).json({mensaje:'producto no encontrado'})
        }else{
            res.json({mensaje:'producto encontrado',product: producto});
        }
    },
    uploadProd:(req,res)=>{
        let lectura = readFileSync(filePath2,'utf8');
        let data = JSON.parse(lectura);
        let {name, description, price, stock}= req.body
        let newProduct = {
            id:data.length+1,
            name: name,
            description: description,
            price: price,
            stock: stock
        }
        data.push(newProduct);
        writeFileSync(filePath2,JSON.stringify(data,null,2));
        res.json({mensaje:'producto creado exitosamente', product: newProduct});
    },
    updateProd:(req,res)=>{
        let {id} = req.params
        let lectura = readFileSync(filePath2,'utf8');
        let data = JSON.parse(lectura);
        let producto = data.find(a=>a.id == id)
        let {name,description,price,stock} = req.body;
        if(!producto){
            return res.status(404).json({mensaje:'producto no encontrado'})
        }
        if(name){producto.name = name};
        if(description){producto.description = description};
        if(price){producto.price = price};
        if(stock){producto.stock = stock};
        let productoM = data.find(e=>e.id==id);
        writeFileSync(filePath2,JSON.stringify(data,null,2));
        res.json({mensaje:'producto editado exitosamente', product: productoM});
    },
    deleteProd:(req,res)=>{
        let {id} = req.params;
        let lectura = readFileSync(filePath2,'utf8');
        let data = JSON.parse(lectura);
        let productDelete = data.find(a=>a.id == id);
        if(!productDelete){
            return res.status(404).json({mensaje:'el producto no se encuentra o ya fue eliminado'})
        }
        let filtro = data.filter(e=>e.id != id);
        writeFileSync(filePath2,JSON.stringify(filtro,null,2));
        res.json({mensaje:'producto eliminado exitosamente', products: filtro})
    }
}