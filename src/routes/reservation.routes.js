'use strict'

const express = require('express');
const api = express.Router();
const midAuth = require('../services/auth');
const reservationController = require('../controllers/reservation.controller');

api.get('/testReservation', [midAuth.ensureAuth, midAuth.isAdmin], reservationController.testReservation);

//* Usuarios registrados 
api.post('/reserveRoom/:idHotel/:idRoom', [midAuth.ensureAuth, midAuth.isClient], reservationController.reserveRoom);

api.get('/myReserve', [midAuth.ensureAuth, midAuth.isClient], reservationController.myReserve)

api.post('/addServiceMyReserve/:serviceId', [midAuth.ensureAuth, midAuth.isClient], reservationController.addServiceMyReserve)

/* api.get('/getReservation/:id', [midAuth.ensureAuth, midAuth.isClient], reservationController.getReservation);
api.get('/getReservations/:idHotel', [midAuth.ensureAuth, midAuth.isClient], reservationController.getReservations);

api.delete('/deleteReservation/:idHotel/:idReservation', [midAuth.ensureAuth, midAuth.isClient], reservationController.deleteReservation); */

//* Administrador del hotel

module.exports = api;