'use strict'

const express = require('express');
const api = express.Router();
const midAuth = require('../services/auth');
const hotelController = require('../controllers/hotel.controller');

api.get('/testHotel', [midAuth.ensureAuth, midAuth.isAdmin], hotelController.testHotel);
api.post('/addHotel', [midAuth.ensureAuth, midAuth.isHotelAdmin], hotelController.addHotel);

api.get('/getHotel/:id', [midAuth.ensureAuth, midAuth.isHotelAdmin], hotelController.getHotel);
api.get('/getHoteles', [midAuth.ensureAuth, midAuth.isHotelAdmin], hotelController.getHotels);

api.put('/updateHotel/:id', [midAuth.ensureAuth, midAuth.isHotelAdmin], hotelController.updateHotel);
api.delete('/deleteHotel/:id', [midAuth.ensureAuth, midAuth.isHotelAdmin], hotelController.deleteHotel);

module.exports = api;