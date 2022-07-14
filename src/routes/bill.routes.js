'use strict' 


const express = require('express');
const billController = require('../controllers/bill.controller');
const api = express.Router();
const midAuth = require('../services/auth'); 

api.get('/testBill', billController.testBill);  
api.post('/createBill', [midAuth.ensureAuth], billController.createBill);
api.get('/getBills',[midAuth.ensureAuth],billController.searchBills)

module.exports = api;