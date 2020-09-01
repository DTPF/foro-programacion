'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "clave_secreta_para_generar_el_token-655498";

exports.authenticated = function (req, res, next) {

    // Comprobar si llega autorizacion
    if (!req.headers.authorization) {
        return res.status(403).send({
            message: 'La petición no tiene la cabecera de authorization'
        });
    }

    // Limpiar el token y quitar comillas
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        // Decodificar token
        var payload = jwt.decode(token, secret);

        // Comprobar si el token ha expirado
        if(payload.exp <= moment().unix()){
            return res.status(403).send({
                message: 'El token ha expirado'
            });
        }

    } catch (ex) {
        return res.status(403).send({
            message: 'El token no es válido'
        });
    }    

    // Adjuntar usuarrio identificado a request
    req.user = payload;

    // Pasar a la acción
    next();
};
