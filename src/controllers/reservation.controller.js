'use strict'

const Reservation = require('../models/reservation.model');
const { validateData } = require('../utils/validate');
const Room = require('../models/room.model')
const User = require('../models/user.model')
const Hotel = require('../models/hotel.model')
const Service = require('../models/service.model')

exports.testReservation = (req, res) => {
    return res.send({ message: 'Función de prueba desde el controlador de Reservaciones' });
}


exports.addReservation = async (req, res) => {
    try {
        const userId = req.user.sub;
        const serviceId = req.body.idServe;
        const params = req.body;
        const data = {
            startDate: params.startDate,
            endDate: params.endDate,
            totalPrice: params.totalPrice,
            state: params.state,
            user: params.user,
            hotel: params.hotel,
            room: params.room,
        }
        const msg = validateData(data);
        if (!msg) {
            const hotelExist = await Hotel.findOne({ _id: data.hotel });
            if (!hotelExist) {
                return res.status(400).send({ message: 'Hotel no encontrado' })
            } else {
                const userExist = await User.findOne({ _id: data.user });
                if (!userExist) {
                    return res.status(400).send({ message: 'Usuario no encontrado' });
                } else {
                    const roomExist = await Room.findOne({ _id: data.room });
                    if (!roomExist) {
                        return res.status(400).send({ message: 'Habitación No encontrada' });
                    } else {
                        const reserve = new Reservation(data);
                        const reserSaved = await reserve.save();
                        await Service.findOneAndUpdate({ _id: serviceId }, { $push: { services: reserSaved } })
                        return res.send({ message: 'Reservación Agregada' })
                    }
                }
            }
        }

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error creando la reservacion' })
    }
}