'use strict'

const express = require('express');
const api = express.Router();
const midAuth = require('../services/auth');
const roomController = require('../controllers/room.controller');

//* Administrador
api.get('/test', [midAuth.ensureAuth, midAuth.isAdmin], roomController.test);

//* Usuarios registrados
api.get('/getRooms_Clients/:idHotel', midAuth.ensureAuth, roomController.getRooms_Clients);

//* Administrador del hotel
api.post('/addRoom', [midAuth.ensureAuth, midAuth.isHotelAdmin], roomController.addRoom);

api.get('/getRooms/:idHotel', [midAuth.ensureAuth, midAuth.isHotelAdmin], roomController.getRooms);
api.get('/getRoomsAvailable/:idHotel', [midAuth.ensureAuth, midAuth.isHotelAdmin], roomController.getRoomsAvailable);
api.get('/getRoomsNoAvailable/:idHotel', [midAuth.ensureAuth, midAuth.isHotelAdmin], roomController.getRoomsNoAvailable);
api.get('/getRoom/:idHotel/:idRoom', [midAuth.ensureAuth, midAuth.isHotelAdmin], roomController.getRoom);

api.put('/updateRoom/:idHotel/:idRoom', [midAuth.ensureAuth, midAuth.isHotelAdmin], roomController.updateRoom);

api.delete('/deleteRoom/:idHotel/:idRoom', [midAuth.ensureAuth, midAuth.isHotelAdmin], roomController.deleteRoom);

module.exports = api;