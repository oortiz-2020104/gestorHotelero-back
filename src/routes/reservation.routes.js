'use strict'

const express = require('express');
const api = express.Router();
const midAuth = require('../services/auth');
const reservationController = require('../controllers/reservation.controller');

api.get('/testReservation', [midAuth.ensureAuth, midAuth.isAdmin], reservationController.testReservation);

<<<<<<< HEAD
//* CLIENTE 
api.post('/addReservation', [midAuth.ensureAuth, midAuth.isClient], reservationController.addReservation);
=======
//* Administrador del hotel
api.post('/addReservation', [midAuth.ensureAuth, midAuth.isClient], reservationController.addReservation);

//*Clientes
api.get('/getReservation/:id', midAuth.ensureAuth, reservationController.getReservation)
>>>>>>> develop

module.exports = api;