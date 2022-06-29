'use strict'

const express = require('express');
const api = express.Router();
const midAuth = require('../services/auth');
const hotelController = require('../controllers/hotel.controller');

//* Administrador
api.get('/testHotel', [midAuth.ensureAuth, midAuth.isAdmin], hotelController.testHotel);

api.post('/addHotel_OnlyAdmin', [midAuth.ensureAuth, midAuth.isAdmin], hotelController.addHotel_OnlyAdmin);

api.get('/getHotels_OnlyAdmin', [midAuth.ensureAuth, midAuth.isAdmin], hotelController.getHotels_OnlyAdmin);
api.get('/getHotel_OnlyAdmin/:id', [midAuth.ensureAuth, midAuth.isAdmin], hotelController.getHotel_OnlyAdmin);

api.put('/updateHotel_OnlyAdmin/:id', [midAuth.ensureAuth, midAuth.isAdmin], hotelController.updateHotel_OnlyAdmin);

api.delete('/deleteHotel_OnlyAdmin/:id', [midAuth.ensureAuth, midAuth.isAdmin], hotelController.deleteHotel_OnlyAdmin);

//* Usuarios no registrados
api.get('/getHotels_NoClients', hotelController.getHotels_NoClients);

//* Usuarios registrados
api.get('/getHotels_Clients', midAuth.ensureAuth, hotelController.getHotels_Clients);
api.get('/getHotel_Clients/:id', midAuth.ensureAuth, hotelController.getHotel_Clients);

//* Administrador del hotel
api.post('/addHotel', [midAuth.ensureAuth, midAuth.isHotelAdmin], hotelController.addHotel);

api.get('/getHotel/:id', [midAuth.ensureAuth, midAuth.isHotelAdmin], hotelController.getHotel);
api.get('/getHotels', [midAuth.ensureAuth, midAuth.isHotelAdmin], hotelController.getHotels);

api.put('/updateHotel/:id', [midAuth.ensureAuth, midAuth.isHotelAdmin], hotelController.updateHotel);
api.delete('/deleteHotel/:id', [midAuth.ensureAuth, midAuth.isHotelAdmin], hotelController.deleteHotel);

module.exports = api;