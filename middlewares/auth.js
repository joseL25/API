const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    const SECRET_KEY = process.env.CLAVE_TOKEN;
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies?.token;

    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token.' });
    }

    try {
        // Verificar token
        const decoded = jwt.verify(token, SECRET_KEY);

        // Guardar información del usuario para la siguiente ruta
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
    }
}