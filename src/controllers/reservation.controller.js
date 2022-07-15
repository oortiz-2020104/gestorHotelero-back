'use strict'

const { validateData } = require('../utils/validate');

const User = require('../models/user.model')
const Hotel = require('../models/hotel.model')
const Room = require('../models/room.model')
const Service = require('../models/service.model')
const Reservation = require('../models/reservation.model');

exports.testReservation = (req, res) => {
    return res.send({ message: 'Función de prueba desde el controlador de reservaciones' });
}

//* Funciones usuario registrado ---------------------------------------------------------------------------------------

exports.reserveRoom = async (req, res) => {
    try {
        const userId = req.user.sub
        const hotelId = req.params.idHotel
        const roomId = req.params.idRoom
        const params = req.body;
        const data = {
            startDate: params.startDate,
            endDate: params.endDate,
        }

        const msg = validateData(data);
        if (!msg) {
            const userExist = await User.findOne({ _id: userId });
            if (!userExist) {
                return res.status(400).send({ message: 'Usuario no encontrado' });
            } else {
                if (userExist.currentReservation) {
                    return res.status(400).send({ message: 'Ya tienes una reservación actualmente' });
                } else {
                    const hotelExist = await Hotel.findOne({ _id: hotelId });
                    if (!hotelExist) {
                        return res.status(400).send({ message: 'Hotel no encontrado' })
                    } else {
                        const checkHotelRoom = await Room.findOne({ _id: roomId, hotel: hotelId }).populate('hotel').lean()
                        if (checkHotelRoom == null) {
                            return res.status(400).send({ message: 'Esta habitación no pertenece al hotel' })
                        } else {
                            if (checkHotelRoom.available == false) {
                                return res.status(400).send({ message: `Esta habitación esta reservada hasta el ${checkHotelRoom.dateAvailable}` })
                            } else {
                                let date1 = new Date(data.startDate)
                                let date2 = new Date(data.endDate)
                                if (date1 == 'Invalid Date' || date2 == 'Invalid Date') {
                                    return res.status(400).send({ message: 'Las fechas no son válidas' })
                                } else {
                                    let today = new Date().toISOString().split("T")[0]
                                    today = new Date(today)
                                    let differenceToday = date1.getTime() - today.getTime()
                                    if (differenceToday < 0) {
                                        return res.status(400).send({ message: 'Ingresa una fecha de inicio superior' })
                                    } else {
                                        let difference = date2.getTime() - date1.getTime();
                                        if (difference < 0) {
                                            return res.status(400).send({ message: 'Ingresa una fecha de salida superior a la de inicio' })
                                        } else {
                                            if (difference == 0) {
                                                return res.status(400).send({ message: 'No puedes establecer las mismas fechas' })
                                            } else {
                                                let totalDays = Math.ceil(difference / (1000 * 3600 * 24));
                                                data.totalPrice = checkHotelRoom.price * totalDays
                                                data.state = 'En curso'
                                                data.user = req.user.sub
                                                data.hotel = hotelId
                                                data.room = roomId

                                                const reservation = new Reservation(data)
                                                await reservation.save();

                                                let getTimesRequested = hotelExist.timesRequest + 1

                                                await Hotel.findOneAndUpdate({ _id: hotelId }, { timesRequest: getTimesRequested }, { new: true }).lean()
                                                await Room.findOneAndUpdate({ _id: roomId, hotel: hotelId }, { available: false, dateAvailable: date2.toISOString().split("T")[0], currentUser: userExist._id }, { new: true }).lean()
                                                await User.findOneAndUpdate({ _id: req.user.sub }, { currentReservation: reservation._id, $push: { reservations: reservation._id, history: hotelId } }, { new: true }).lean();

                                                return res.send({ message: 'Habitación reservada, ya puedes ir a tu reservación', reservation })
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error creando la reservacion' })
    }
}

exports.myReserve = async (req, res) => {
    try {
        const userId = req.user.sub

        const checkUser = await User.findOne({ _id: userId }).lean();
        if (!checkUser) {
            return res.status(400).send({ message: 'Usuario no encontrado' });
        } else {
            const myReservation = await Reservation.findOne({ _id: checkUser.currentReservation }).populate('hotel').populate('room').populate('services.service').lean();
            if (!myReservation) {
                return res.status(400).send({ message: 'Actualmente no cuentas con una reservación' });
            } else {
                return res.send({ message: 'Tú reservación', myReservation })
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error obteniendo la reservación' });
    }
}

exports.addServiceMyReserve = async (req, res) => {
    try {
        const params = req.body
        const userId = req.user.sub
        const data = {
            service: req.params.serviceId,
            quantity: params.quantity,
        }

        const msg = validateData(data);
        if (!msg) {
            const checkUser = await User.findOne({ _id: userId }).lean();
            if (!checkUser) {
                return res.status(400).send({ message: 'Usuario no encontrado' });
            } else {
                const myReservation = await Reservation.findOne({ _id: checkUser.currentReservation }).populate('hotel').populate('room').populate('services').lean();
                if (!myReservation) {
                    return res.status(400).send({ message: 'Actualmente no cuentas con una reservación' });
                } else {
                    const hotelId = myReservation.hotel
                    const checkServiceHotel = await Service.findOne({ _id: data.service, hotel: hotelId }).lean()
                    if (!checkServiceHotel || checkServiceHotel == null) {
                        return res.status(400).send({ message: 'Este servicio no se encuentra en el hotel que haz reservado' });
                    } else {
                        let servicePrice = checkServiceHotel.price * parseInt(data.quantity)
                        let newTotalPrice = myReservation.totalPrice + servicePrice

                        const pushService = await Reservation.findOneAndUpdate({ _id: checkUser.currentReservation }, { totalPrice: newTotalPrice, $push: { services: { quantity: data.quantity, service: data.service } } }, { new: true }).lean()

                        return res.send({ message: 'Servicio añadido', pushService })
                    }
                }
            }
        } else {
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error añadiendo un servicio a tu reservación' })
    }
}

//* Funciones admnistrador del hotel ---------------------------------------------------------------------------------------

exports.getReservations = async (req, res) => {
    try {
        const hotelId = req.params.idHotel;
        const userId = req.params.sub;

        const checkHotelReservation = await Hotel.findOne({ _id: hotelId });
        if (!checkHotelReservation) {
            return res.status(404).send({ message: 'El hotel no existe' });
        } else {
            const reservations = await Reservation.find({ hotel: hotelId }).populate('hotel').lean();
            if (!reservations) {
                return res.status(400).send({ message: 'Habitaciones no encontradas' });
            } else {
                return res.send({ message: 'Habitaciones encontradas', reservations })
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo las reservaciones' })
    }
}

exports.deleteReservation = async (req, res) => {
    try {
        const hotelId = req.params.idHotel;
        const reservationId = req.params.idReservation;

        const hotelExist = await Hotel.findOne({ _id: hotelId });
        if (!hotelExist) {
            return res.status(400).send({ message: 'Hotel no encontrado' });
        } else {
            const checkHotelReservation = await Reservation.findOne({ _id: reservationId, hotel: hotelId }).populate('hotel').lean();
            if (checkHotelReservation == null || checkHotelReservation.hotel._id != hotelId) {
                return res.status(400).send({ message: 'No puedes eliminar esta reservación' })
            } else {
                const reservationDeleted = await Reservation.findOneAndDelete({ _i: reservationId, hotel: hotelId }).populate('hotel').lean()
                if (!reservationDeleted) {
                    return res.status(400).send({ message: 'Reservación no encontrada o ya eliminada' })
                } else {
                    return res.send({ message: 'Reservación eliminada correctamente', reservationDeleted })
                }
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ err, message: 'Error' });
    }
}