'use strict'
const mongoose = require('mongoose')

const userSchema = Schema({
    name: String,
    surname: String,
    username: String,
    password: String,
    email: String,
    image: String,
    role: String,
    phone: String,
    reservations: [{ type: Schema.ObjectId, ref: 'reservation' }],
    history: [{ type: Schema.ObjectId, ref: 'hotel' }],
    bill: [{ type: Schema.ObjectId, ref: 'bill' }]
});

module.exports = mongoose.model('user', userSchema)