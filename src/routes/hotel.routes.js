'use strict'

const express = require('express');
const api = express.Router();
const midAuth = require('../services/auth');  
const hotelController = require('../controllers/hotel.controller');

api.get('/testHotel', hotelController.testHotel);
api.post('/addHotel', [midAuth.ensureAuth, midAuth.isAdmin], hotelController.addHotel);
api.get('/getHoteles', hotelController.getHoteles);
api.get('/getHotel/:id', hotelController.getHotel);
api.delete('/deleteHotel/:id', [midAuth.ensureAuth, midAuth.isAdmin],hotelController.deleteHotel);
api.put('/updateHotel/:id', [midAuth.ensureAuth, midAuth.isAdmin],hotelController.updateHotel);

module.exports = api;