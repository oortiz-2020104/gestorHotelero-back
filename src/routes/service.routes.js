'use strict'

const express = require('express');
const api = express.Router();
const midAuth = require('../services/auth');
const serviceController = require('../controllers/service.controller');

//* Administrador
api.get('/testServices', [midAuth.ensureAuth, midAuth.isAdmin], serviceController.testServices);

//* Usuarios registrados
api.get('/getServices_Clients/:idHotel', midAuth.ensureAuth, serviceController.getServices_Clients);

//* Administrador del hotel
api.post('/addService/:idU', [midAuth.ensureAuth, midAuth.isClient], serviceController.addService);

api.get('/getServices/:idHotel', [midAuth.ensureAuth, midAuth.isHotelAdmin], serviceController.getServices);
api.get('/getService/:idHotel/:idService', [midAuth.ensureAuth, midAuth.isHotelAdmin], serviceController.getService);

api.put('/updateService/:idHotel/:idService', [midAuth.ensureAuth, midAuth.isHotelAdmin], serviceController.updateService);

api.delete('/deleteService/:idHotel/:idService', [midAuth.ensureAuth, midAuth.isHotelAdmin], serviceController.deleteService);

api.delete('/delete/:idU/:idC', [midAuth.ensureAuth, midAuth.isHotelAdmin], serviceController.deleteServiceAtReservation_OnlyAdmin);

module.exports = api;