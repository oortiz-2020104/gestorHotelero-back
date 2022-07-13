'use strict'
const mongoose = require('mongoose')

const billSchema = mongoose.Schema({
    date: {type: Date, default: Date.now()},
    total: Number,
    reservation: {
        type: mongoose.Schema.ObjectId,
        ref: 'reservation'
    }
})

module.exports = mongoose.model('bill', billSchema)