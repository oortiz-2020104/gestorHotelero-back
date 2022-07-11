'use strict'

const express = require('express');
const api = express.Router();
const midAuth = require('../services/auth');
const reservationController = require('../controllers/reservation.controller');

api.get('/testReservation', [midAuth.ensureAuth, midAuth.isAdmin], reservationController.testReservation);

//* CLIENTE 
api.post('/addReservation', [midAuth.ensureAuth, midAuth.isClient], reservationController.addReservation);

module.exports = api;