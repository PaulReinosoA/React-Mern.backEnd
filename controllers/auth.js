// funciones del callback de auths
//si el intelicense falla:, esta referencia ayuda
const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');

// req-> nos solicitan; res-> nosotros respondemos
const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    // si no encuentra usuario es null
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'un usuario existe con ese correo',
      });
    }

    usuario = new Usuario(req.body);

    // encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    // genero json web token
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
      msg: 'usuario creado exitosamente :)',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'comuniquese con el administrador de la BD',
    });
  }
};

const loginUsuario = async (req, res = responsees) => {
  const { email, password } = req.body;

  try {
    // si no encuentra usuario es null
    let usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'el usuario no existe con ese correo',
      });
    }

    //confirmar password
    const validaPassword = bcrypt.compareSync(password, usuario.password);

    if (!validaPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'password incorrecto',
      });
    }

    // genero json web token
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
      msg: 'singin conrrecto!!! :)',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'comuniquese con el administrador de la BD',
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const tokenEncrypt = req.header('x-token');

  if (!tokenEncrypt) {
    return res.status(401).json({
      ok: false,
      msg: 'No se pudo obtener el token en la peticion',
    });
  }

  const payload = jwt.decode(tokenEncrypt, process.env.SECRET_JWT_SEED);
  const { uid, name } = payload;

  // generar nuevo jwt y retornarlo en la peticion
  const token = await generarJWT(uid, name);

  res.status(200).json({
    ok: true,
    name,
    uid,
    token,
    msg: 'token renew',
  });
};

module.exports = { crearUsuario, loginUsuario, revalidarToken };

// documentacion errores de peticiones:
// https://www.restapitutorial.com/httpstatuscodes

// paquetes para validaciones de express(express validators):
// npm i express-validator
