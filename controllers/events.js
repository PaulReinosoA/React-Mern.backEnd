const { response } = require('express');
const Events = require('../models/Events');

const getEventos = async (req, res = response) => {
  const eventos = await Events.find().populate('user', 'name'); // populate: referencia a rellenar para ver su info

  res.status(201).json({
    ok: true,
    eventos,
    msg: 'getEventos conrrecto!!! :)',
  });
};

const crearEvento = async (req, res = response) => {
  const evento = new Events(req.body);

  try {
    evento.user = req.uid;
    const eventoGuardado = await evento.save();

    return res.status(201).json({
      ok: true,
      evento: eventoGuardado,
      msg: 'crearEvento evento creado correctamente! ;)',
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: `crearEvento INCORRECTO!!! ${error}`,
    });
  }
};

const actualizarEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;
  // console.log('req.params', req.params);
  try {
    const evento = await Events.findById(eventoId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: 'evento no existe',
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'el usuario no puede modificar este evento',
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    const eventoActulizado = await Events.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      { new: true }
    );

    res.status(201).json({
      ok: true,
      eventoActulizado,
      msg: 'evento modificado',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: `actualizarEvento error! ${error}`,
    });
  }
};

const eliminarEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;
  // console.log('req.params', req.params);
  try {
    const evento = await Events.findById(eventoId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: 'evento no existe',
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'el usuario no puede modificar este evento',
      });
    }

    const eventoBorrado = await Events.findByIdAndDelete(eventoId);

    if (!eventoBorrado) {
      return res.status(500).json({
        ok: false,
        msg: 'eliminarEvento error!',
      });
    } else {
      res.status(201).json({
        ok: true,
        eventoBorrado,
        msg: 'eliminarEvento conrrecto!!! :)',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: `actualizarEvento error! ${error}`,
    });
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
