const path = require('path');
const exprees = require('express');
const cors = require('cors');
//! npm i dotenv --> configurar variables de entorino en el proyecto:
require('dotenv').config();

const { dbConnection } = require('./database/config');
// console.log(process.env)

//! crear el servidor de express;
const app = exprees();

//! Base de datos:
dbConnection();

//! CORS
app.use(cors());

//! directorio publico:
// middlewre : funcion q se ejecuta siempre al hacer la peticion al servidor
app.use(exprees.static('public')); // path del directorio!!!

//!Lectura y parceo del body:
app.use(exprees.json());

//! Rutas:
//* todo AUTH : crear, login , renew
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// para el despliegue en considerando que express vera las rutas del dist del  frond en los archivos  del public
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// app.get('/', (req, res) => {
//   // console.log('se requiere el /');
//   res.json({
//     ok: true,
//   });
// });

//* todo CRUD: eventos

//! escucha peticiones:
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto : ${process.env.PORT}`);
});
