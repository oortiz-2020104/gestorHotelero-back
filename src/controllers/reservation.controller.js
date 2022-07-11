'use strict'

const Reservation = require('../models/reservation.model');
const { validateData } = require('../utils/validate');
const Room = require('../models/room.model')
const User = require('../models/user.model')
const Hotel = require('../models/hotel.model')
const Service = require('../models/service.model');


exports.testReservation = (req, res) => {
    return res.send({ message: 'Función de prueba desde el controlador de Reservaciones' });
}


exports.addReservation = async (req, res) => {
    try {
   
        const params = req.body;
        const userId = req.user.sub;
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
                return res.status(404).send({ message: 'Hotel no encontrado' });
            } else {
                if (hotelExist.adminHotel != userId) {
                    return res.status(404).send({ message: 'No puedes agregar el hotel a la reservacion' })
                } else {
                    const userExist = await User.findOne({ _id: data.user });
                    if (!userExist) {
                        return res.status(400).send({ message: 'Usuario no encontrado' })
                    } else {
                        // if (userExist.adminHotel != userId) {
                        //     return res.status(404).send({ message: 'No puedes agregar al usuario a la reservación' });
                        // } else {
                        const roomExist = await Room.findOne({ _id: data.room });
                        if (!roomExist) {
                            return res.status(400).send({ message: 'Habitación no encontrada' });
                        } else {
                            // if (roomExist.adminHotel != userId) {
                            //     return res.status(404).send({ message: 'No puedes agregar una habitación a la reservación' })
                            // } else {
                            const reserve = new Reservation(data);
                            await reserve.save()
                            
                            return res.send({ message: 'Reservacación agregada', });
                        }
                    }
                    // }
                    // }
                }
            }
        } else {
            return res.status(400).send(msg)
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error creando la reservacion' })
    }
}

exports.getReservation = async(req, res)=>{
    try{
        const reservationId = req.params.id;
        const reservation = await Reservation.findOne({_id: reservationId})
        .lean()
        .populate('services');
        if(!reservation) return res.status(404).send({message: 'Product not found'});
        return res.send({message: 'Reservation found:', reservation});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting product'});
    }
}

