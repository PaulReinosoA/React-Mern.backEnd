/*
RUTES DE USURIOS /mAuth  :
host +  /api/events
*/
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require('../controllers/events');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');

const router = Router();

//* linea que DEFINE: TODAS LAS RUTAS bajo esta linea validaran JWT
router.use(validarJWT);

router.get('/' /*, validarJWT*/, [], getEventos);

router.post(
  '/' /*, validarJWT*/,
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'La fecha de inicio es obligatoria').custom(isDate),
    check('end', 'La fecha de fin es obligatoria').custom(isDate),
    validarCampos,
  ],
  crearEvento
);

router.put(
  '/:id' /*, validarJWT*/,
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'La fecha de inicio es obligatoria').custom(isDate),
    check('end', 'La fecha de fin es obligatoria').custom(isDate),
    validarCampos,
  ],
  actualizarEvento
);

router.delete('/:id' /*, validarJWT*/, eliminarEvento);

module.exports = router;
