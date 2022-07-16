'use strict'

const express = require('express');
const api = express.Router();
const midAuth = require('../services/auth');
const reservationController = require('../controllers/reservation.controller');

api.get('/testReservation', [midAuth.ensureAuth, midAuth.isAdmin], reservationController.testReservation);

//* Usuarios registrados 
api.post('/reserveRoom/:idHotel/:idRoom', [midAuth.ensureAuth, midAuth.isClient], reservationController.reserveRoom);

api.get('/myReserve', [midAuth.ensureAuth, midAuth.isClient], reservationController.myReserve)

api.post('/addServiceMyReserve/:idService', [midAuth.ensureAuth, midAuth.isClient], reservationController.addServiceMyReserve)

//* Administrador del hotel
api.get('/getReservations/:idHotel', [midAuth.ensureAuth, midAuth.isHotelAdmin], reservationController.getReservations);
api.get('/getReservations/:idHotel/:idReservation', [midAuth.ensureAuth, midAuth.isHotelAdmin], reservationController.getReservation);
api.get('/getServicesReservation/:idHotel/:idReservation', [midAuth.ensureAuth, midAuth.isHotelAdmin], reservationController.getServicesReservation);

api.delete('/deleteServiceReservation/:idHotel/:idReservation/:idService', [midAuth.ensureAuth, midAuth.isHotelAdmin], reservationController.deleteServiceReservation);
api.delete('/cancelReservation/:idHotel/:idReservation', [midAuth.ensureAuth, midAuth.isHotelAdmin], reservationController.cancelReservation);


module.exports = api;