'use strict'

const express = require('express');
const api = express.Router();
const midAuth = require('../services/auth');
const roomController = require('../controllers/room.controller');
//Admin
api.get('/test',[midAuth.ensureAuth, midAuth.isAdmin],roomController.test);

//Hotel Admin
api.post('/addRoom',[midAuth.ensureAuth, midAuth.isHotelAdmin],roomController.addRoom);
api.put('/updateRoom/:idHotel/:idRoom', [midAuth.ensureAuth, midAuth.isHotelAdmin],roomController.updateRoom);
api.delete('/deleteRoom/:idHotel/:idRoom', [midAuth.ensureAuth, midAuth.isHotelAdmin],roomController.deleteRoom);
api.get('/getRoomsAvailable/:idHotel',[midAuth.ensureAuth, midAuth.isHotelAdmin], roomController.getRoomsAvailable);

//Usuarios
api.get('/getRooms/:idHotel',[midAuth.ensureAuth], roomController.getRooms);


module.exports = api;