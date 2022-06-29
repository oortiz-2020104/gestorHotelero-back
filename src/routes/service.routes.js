'use strict'

const express = require('express');
const api = express.Router();
const midAuth = require('../services/auth');
const serviceController = require('../controllers/service.controller');


api.get('/testServices', serviceController.testServices);

api.post('/saveService', [midAuth.ensureAuth, midAuth.isAdmin],  serviceController.saveService);

api.put('/updateService/:id',[midAuth.ensureAuth,midAuth.isAdmin], serviceController.updateService);

api.get('/getService/:id',midAuth.ensureAuth, serviceController.getService);

api.get('/getServices', midAuth.ensureAuth, serviceController.getServices);

api.delete('/deleteServices/:id', [midAuth.ensureAuth, midAuth.isHotelAdmin], serviceController.deleteServices);





module.exports = api;