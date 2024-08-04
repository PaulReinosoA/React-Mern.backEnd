/*
RUTES DE USURIOS /mAuth  :
host +  /api/auth
*/
const exprees = require('express');
const router = exprees.Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const {
  crearUsuario,
  revalidarToken,
  loginUsuario,
} = require('../controllers/auth');

router.post(
  '/new',
  [
    // middlewares:
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe tener 6 caracteres').isLength({
      min: 6,
    }),
    validarCampos,
  ],
  crearUsuario
);

router.post(
  '/',
  [
    // middlewares:
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email es invalido').isEmail(),
    check('password', 'El password debe tener 6 caracteres').isLength({
      min: 6,
    }),
    validarCampos,
  ],
  loginUsuario
);

router.get('/renew',/* validarJWT,*/ revalidarToken);

module.exports = router;
