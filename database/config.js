const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.BD_CNN);
    console.log('DB Online');
  } catch (error) {
    console.log('Error initializing DB');
  }
};

module.exports = { dbConnection };


// https://railway.app/  despliegue!