//si el intelicense falla:, esta referencia ayuda
const { response } = require('express');
const { validationResult } = require('express-validator');

// req-> nos solicitan; res-> nosotros respondemos; next-> funcion a llamar si todo se ejecuta pide la siguinete
const validarCampos = (req, res = response, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }

  next();
};

module.exports = { validarCampos };
