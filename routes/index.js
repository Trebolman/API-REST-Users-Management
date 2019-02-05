const express = require('express');
const router = express.Router();
const passport = require('passport');

var Usuario = require('../models/Users/user');
var Compra = require('../models/Users/purchase');
var Producto = require('../models/Users/product');
var Envio = require('../models/Users/send');

// ************ USUARIOS **********************
// AUTENTICACION
// LOGIN
router.post('/login', (req, res) => {
    console.log("index|login|req.body");
    console.log(req.body);
    passport.authenticate('local', function (err, user, info) {
        console.log("index|login|err");
        console.log(err);
        console.log("index|login|user");
        console.log(user);
        console.log("index|login|info");
        console.log(info);
        var token;
        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        // If a user is found
        if (user) {
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);
});

// CREAR USUARIO
router.post('/create-user', (req, res) => {
    console.log("index|user|post|req.body");
    console.log(req.body);
    let { user_username, user_name, user_lastname, user_email, user_pass} = req.body;
    let user = new Usuario({
        user_username,
        user_name,
        user_lastname,
        user_email,
        user_role : 3,
        user_status: 'Activo',
        purchases_list: []
    });
    user.setPassword(user_pass);

    Usuario.findOne({user_username}, (req, usuario) => {
        if (usuario == null) {
            console.log('Usuarios|find|usuario');
            console.log(usuario);
            var usuario = new Usuario();
            usuario = user;
        } else {
            var usuario = usuario;
            console.log('Usuarios|find|usuarios');
            console.log(usuario);
        }

        usuario.save((err, usuario) => {
            console.log('usuario|agregarUsuario|find|else|save|usuario');
            console.log(usuario);
            if (err) {
                console.log(err);
                return res.status(500).send({ Error: "Error 500 saving user" });
            }
            if (!usuario) {
                return res.status(404).send({ Error: "Error 404 saving user" });
            }
            var token;
            oken = user.generateJwt();
            return res.status(200).send(usuario);
        });
    });
});

// CREAR ADMIN Y/O OPERADOR
router.post('/create-admin-operator', (req, res) => {
    console.log("index|user|post|req.body");
    console.log(req.body);
    let { user_username, user_name, user_lastname, user_email, user_pass, user_role} = req.body;
    let user = new Usuario({
        user_username,
        user_name,
        user_lastname,
        user_email,
        user_role,
        user_status: 'Activo'
    });
    user.setPassword(user_pass);

    Usuario.findOne({user_username}, (req, usuario) => {
        if (usuario == null) {
            console.log('Usuarios|find|usuario');
            console.log(usuario);
            var usuario = new Usuario();
            usuario = user;
        } else {
            var usuario = usuario;
            console.log('Usuarios|find|usuarios');
            console.log(usuario);
        }

        usuario.save((err, usuario) => {
            console.log('usuario|agregarUsuario|find|else|save|usuario');
            console.log(usuario);
            if (err) {
                console.log(err);
                return res.status(500).send({ Error: "Error 500 saving user" });
            }
            if (!usuario) {
                return res.status(404).send({ Error: "Error 404 saving user" });
            }
            var token;
            oken = user.generateJwt();
            return res.status(200).send(usuario);
        });
    });
});

// DESACTIVAR USUARIO (cambio de estado a inactivo)
router.put('/desact-user', (req, res) => {
    let { user_username } = req.body;
    Usuario.findOne({user_username},(err,usuario)=>{
        if(err) return res.status(404).send({Error: 'Error 404: Usuario no encontrado'});
        else if(!usuario) return res.status(500).send({Error: 'Error 500: Error en la búsqueda de usuario'});
        usuario.user_status = 'Inactivo';
        usuario.save((err, usuario) => {
            console.log('usuario|agregarUsuario|find|else|save|usuario');
            console.log(usuario);
            if (err) {
                console.log(err);
                return res.status(500).send({ Error: "Error 500 saving user" });
            }
            if (!usuario) {
                return res.status(404).send({ Error: "Error 404 saving user" });
            }
            return res.status(200).send(usuario);
        });
    })
});

// ELIMINAR DEFINITIVAMENTE
router.delete('/delete-user', (req, res) => {
    let { user_username } = req.body;
    Usuario.findOneAndDelete({user_username},(err,usuario)=>{
        if(err) return res.status(404).send({Error: 'Error 404: Usuario no encontrado'});
        else if(!usuario) return res.status(500).send({Error: 'Error 500: Error en la búsqueda de usuario'});
        usuario.save((err, usuario) => {
            console.log('usuario|agregarUsuario|find|else|save|usuario');
            console.log(usuario);
            if (err) {
                console.log(err);
                return res.status(500).send({ Error: "Error 500 deleting user" });
            }
            if (!usuario) {
                return res.status(404).send({ Error: "Error 404 deleting user" });
            }
            return res.status(200).send(usuario);
        });
    })
});

// TRAER USUARIO
router.get('/get-user/:user_username', (req, res) => {
    let { user_username } = req.params;
    Usuario.findOne({user_username}, (req, usuario) => {
        if (usuario == null) {
            console.log('Usuario|find|usuario');
            console.log(usuario);
            return res.status(500).send({ Error: "Cree un usuario primero" });
        } else {
            console.log('Usuarios|find|usuario');
            console.log(usuario);
            return res.status(200).send(usuario);
        }
    });
});

// ************** PRODUCTOS ********************
// AGREGAR COMPRA (ADD PURCHASE)
router.post('/push-purchase', (req, res)=>{
    let { purchase, user_username } = req.body;
    // let producto = new Producto({
    //     prod_name: 'Huawei',
    //     prod_image: '',
    //     prod_currency: 'USD',
    //     prod_price: 1250.5,
    //     prod_state: 'Correcto',
    //     prod_amount: 1,
    //     prod_totalPay: 1250.5
    // });

    // let Purchase = new Compra({
    //     purchase_date : new Date,
    //     send_details : {}
    // }); 
    // Purchase.prod_details.push(producto);
    console.log('push-purchase|Purchase');
    console.log(purchase);
    if(purchase != null){
        Usuario.findOneAndUpdate({user_username},{$push:{purchases_list:purchase}},{new:true},(err, doc, response)=>{
            if(err) return res.send(500).send({Error: "Error 500: Error al guardar compra"});
            else if(doc){
                let index = doc.purchases_list.length;
                let lastPurchase = doc.purchases_list[index - 1];
                return res.status(200).send(lastPurchase);
            }
        });
    }else{
        return res.send(500).send({Error:'Error 500: "Purchase" vacio'});
    }
});

// QUITAR COMPRA (REMOVE PURCHASE)
router.delete('/delete-purchase', (req, res)=>{
    let { id, user_username } = req.body;

    Usuario.findOneAndUpdate({user_username},{$pull:{purchases_list:{_id:id}}},{new:true},(err, doc, response)=>{
        if(err) return res.send(500).send({Error: "Error 500: Error al guardar compra"});
        else if(doc){
            return res.status(200).send(doc);
        }
    });
});

module.exports = router;