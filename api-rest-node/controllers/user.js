'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
var User = require('../models/user');
var jwt = require('../services/jwt');

var controller = {

    probando: function (req, res) {
        return res.status(200).send({
            message: "Soy el método probando"
        });
    },

    testeando: function (req, res) {
        return res.status(200).send({
            message: "Soy el método testeando"
        });
    },

    save: function (req, res) {
        // Recoger los parámetros de la petición
        var params = req.body;

        // Validar los datos
        console.log(params);
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (err) {
            return res.status(200).send({
                message: "Falta datos por enviar",
            });
        }

        // console.log(validate_name, validate_surname, validate_email, validate_password);
        if (validate_name && validate_surname && validate_password && validate_email) {
            // Crear objeto de usuario
            var user = new User();

            // Asignar valores al usuario
            user.name = params.name;
            user.surname = params.surname;
            user.email = params.email.toLowerCase();
            user.role = 'ROLE_USER';
            user.image = null;

            // Comprobar si el usuario existe
            User.findOne({ email: user.email }, (err, issetUser) => {
                if (err) {
                    return res.status(500).send({
                        message: "Error al comprobar duplicidad del usuario",
                    });
                }

                if (!issetUser) {
                    // Si no existe,

                    // cifrar la contraseña
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;

                        // y guardar usuarios
                        user.save((err, userStored) => {
                            if (err) {
                                return res.status(500).send({
                                    message: "Error al guardar el usuario",
                                });
                            }

                            if (!userStored) {
                                return res.status(400).send({
                                    message: "El usuario no se ha guardado",
                                });
                            }
                            // Devolver respuesta
                            return res.status(200).send({
                                status: 'success',
                                user: userStored
                            });

                        }); // close save
                    }); // close bcrypt

                } else {
                    return res.status(200).send({
                        message: "El usuario ya está registrado",
                    });
                }
            });


        } else {
            return res.status(200).send({
                message: "Validación de los datos del usuario incorrecta, inténtalo de nuevo.",
            });
        }
    },

    login: function (req, res) {
        // Recoger los parametros de la petición
        var params = req.body;

        // Validar los datos
        try {
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (err) {
            return res.status(200).send({
                message: "Falta datos por enviar",
            });
        }

        if (!validate_email, !validate_password) {
            return res.status(200).send({
                message: "Los datos son incorrectos, envialos bien."
            });
        }

        // Buscar usuarios que coincidan con el email
        User.findOne({ email: params.email.toLowerCase() }, (err, user) => {

            if (err) {
                return res.status(500).send({
                    message: "Error al intentar identificarse",
                });
            }

            if (!user) {
                return res.status(404).send({
                    message: "El usuario no existe",
                });
            }

            // Si lo encuentra,
            // Comprobar la contraseña (coincidencia de email y password / bcrypt)
            bcrypt.compare(params.password, user.password, (err, check) => {
                // Si es correcto,
                if (check) {

                    //Generar token de jwt y devolverlo (mas tarde)
                    if (params.gettoken) {
                        // Devolver los datos
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        // Limpiar el objeto
                        user.password = undefined;

                        // Devolver los datos
                        return res.status(200).send({
                            status: "success",
                            user
                        });
                    }

                } else {
                    return res.status(200).send({
                        message: "Las credenciales no son correctas",
                    });
                }

            });
        });
    },

    update: function (req, res) {
        // Recoger datos del usuario
        var params = req.body;

        // Validar datos de usuario
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        } catch (err) {
            return res.status(200).send({
                message: "Falta datos por enviar",
            });
        }

        // Eliminar propiedades innecesarias
        delete params.password;

        // Buscar y acttualizar documento
        var userId = req.user.sub;

        // Comprobar si el email es unico
        if (req.user.email != params.email) {
            // Buscar usuarios que coincidan con el email
            User.findOne({ email: params.email.toLowerCase() }, (err, user) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: "Error al intentar identificarse"
                    });
                }

                if (user && user.email == params.email) {
                    return res.status(200).send({
                        message: "El email ya existe"
                    });
                } else {
                    User.findOneAndUpdate({ _id: userId }, params, { new: true }, (err, userUpdated) => {

                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'Error al actualizar el usuario'
                            });
                        }

                        if (!userUpdated) {
                            return res.status(200).send({
                                status: 'error',
                                message: 'No se ha actualizado el usuario'
                            });
                        }
                        // Devolver respuesta
                        return res.status(200).send({
                            status: 'success',
                            message: 'Datos actualizados correctamente',
                            user: userUpdated
                        });
                    });
                }

            });
        } else {
            User.findOneAndUpdate({ _id: userId }, params, { new: true }, (err, userUpdated) => {

                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar el usuario'
                    });
                }

                if (!userUpdated) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'No se ha actualizado el usuario'
                    });
                }
                // Devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    message: 'Datos actualizados correctamente',
                    user: userUpdated
                });
            });
        }
    },

    uploadAvatar: function (req, res) {
        // Configurar el modulo multiiparty (md) routes/user.js

        // Recoger el fichero de la petición
        var file_name = 'Avatar no subido';

        // console.log(req.files);
        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir el nombre y la extension del archivo subido
        var file_path = req.files.file0.path;
        var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extension del archivo
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];


        // Comprobar extension (solo imagenes), si no es valida borrar fichero subido
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif' && file_ext != 'PNG' && file_ext != 'JPG' && file_ext != 'JPEG' && file_ext != 'GIF') {
            fs.unlink(file_path, (err) => {

                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión del archivo no es válida',
                    file: file_ext
                });
            });
        } else {
            // Sacar el id del usuario identificado
            var userId = req.user.sub;

            // Buscar y actualizar documento bd
            User.findOneAndUpdate({ _id: userId }, { image: file_name }, { new: true }, (err, userUpdated) => {

                if (err || !userUpdated) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al guardar avatar de usuario',
                    });
                }
                //Devolver respuesta
                return res.status(200).send({
                    status: 'success',
                    message: 'Foto subida correctamente',
                    user: userUpdated
                });
            });


        }


    },

    avatar: function (req, res) {
        var fileName = req.params.fileName;
        var pathFile = './uploads/users/' + fileName;

        fs.exists(pathFile, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(pathFile));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    },

    getUsers: function (req, res) {
        User.find().exec((err, users) => {
            if (err || !users) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay usuarios que mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                users
            });
        });
    },

    getUser: function (req, res) {
        var userId = req.params.userId;

        User.findById(userId)
            .populate('user')
            .populate('comments.user')
            .exec((err, user) => {
                if (err || !user) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el usuario'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    user
                });
            });

    }

};

module.exports = controller;