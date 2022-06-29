'use strict'

const { validateData, checkUpdateRoom } = require('../utils/validate');

const Room = require('../models/room.model')
const Hotel = require('../models/hotel.model')


exports.test = (req,res)=>{
    return res.send({message:'Función de prueba habitaciones'});
}

exports.addRoom = async (req,res)=>{
    try {
        const params = req.body;
        const userId = req.user.sub;
        const data = {
            hotel: params.hotel,
            name: params.name,
            description: params.description,
            price: params.price,
            available: true,
            dateAvailable: params.dateAvailable
        }

        const msg = validateData(data);
        if(!msg){
            const checkHotel = await Hotel.findOne({_id: data.hotel});
            if (!checkHotel) {
                return res.status(404).send({message:'El hotel no existe'});
            } else {
                if (checkHotel.adminHotel != userId) {
                    return res.status(401).send({message:'No eres el administrador de este hotel'});
                } else {
                    const checkRoomExist = await Room.findOne({name: data.name, hotel: data.hotel}).lean()
                    if (checkRoomExist != null) {
                        return res.status(409).send({message:'Nombre de habitación en uso'});
                    } else {
                        const room = new Room(data);
                        await room.save()
                        return res.send({message: 'Habitación creada satisfactoriamente'});
                    }
                }
            }
        }else{
            return res.status(400).send(msg)
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error creando la habitación' });
    }
}




exports.updateRoom = async(req,res)=>{
    try {
        const hotelId = req.params.idHotel;
        const roomId = req.params.idRoom;
        const userId = req.user.sub;
        const params = req.body;

        const checkUpdate = await checkUpdateRoom(params);
        if (checkUpdate == false) {
            return res.status(400).send({message: 'Parámetros inválidos' });
        } else {
            const hotelExist = await Hotel.findOne({_id: hotelId});
            if (!hotelExist) {
                return res.status(404).send({message: 'El hotel no existe' });
            } else {
                if (hotelExist.adminHotel != userId) {
                    return res.status(401).send({message:'No eres el administrador de este hotel'});
                } else {
                    const checkRoomExist = await Room.findOne({_id: roomId, hotel: hotelId}).lean()
                    if (checkRoomExist == null) {
                        return res.status(404).send({message:'Habitación no encontrada'});
                    } else {

                        const checkRoomName = await Room.findOne({name: params.name, hotel: hotelId}).lean()
                        if (checkRoomName != null) {
                            return res.status(409).send({message:'Nombre de habitación en uso'});
                        } else {
                            const roomUpdated = await Room.findOneAndUpdate({_id: roomId}, params, {new: true}).lean()
                            if (!roomUpdated) {
                                return res.status(400).send({message:'No se pudo actualizar la habitación'});
                            } else {
                                return res.send({message: 'Habitación actualizada satisfactoriamente'})
                            }   
                        } 
                    }
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: 'Error actualizando la habitación' });
    }
}

exports.deleteRoom = async(req,res )=>{
    try {
        const hotelId = req.params.idHotel;
        const roomId = req.params.idRoom;
        const userId = req.user.sub;

        const hotelExist = await Hotel.findOne({_id: hotelId});
        if(!hotelExist){
            return res.status(404).send({message: 'El hotel no existe' });
        }else{
            if (hotelExist.adminHotel != userId) {
                return res.status(401).send({message:'No eres el administrador de este hotel'});
            } else {
                const roomDeleted = await Room.findByIdAndDelete({_id: roomId, hotel: hotelId}).lean();
                if (!roomDeleted) {
                    return res.status(404).send({message: 'Habitación no encontrada'});
                } else {
                    return res.send({message: 'Habitación eliminada', roomDeleted})
                }

            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error creando la habitación' });
    }
}


exports.getRooms = async(req,res)=>{
    try {
        const hotelId = req.params.idHotel;
        const rooms = await Room.find({hotel: hotelId}).lean()
        if (!rooms) {
            return res.status(400).send({message: 'Habitaciones no encontradas'});
        } else {
            return res.send({message: 'Habitaciones encontradas:', rooms});
        }
    } catch (error) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error obteniendo las habitaciones' });
    }
}

exports.getRoomsAvailable = async(req,res)=>{
    try {
        const hotelId = req.params.idHotel;
        const userId = req.user.sub;
        const hotelExist = await Hotel.findOne({_id: hotelId});
        if (!hotelExist) {
            return res.status(404).send({message: 'El hotel no existe' });
        } else {
            if (hotelExist.adminHotel != userId) {
                return res.status(401).send({message:'No eres el administrador de este hotel'});
            } else {
                const rooms = await Room.find({hotel: hotelId, available: true}).lean()
                if (!rooms) {
                    return res.status(400).send({message: 'Habitaciones no encontradas'});
                } else {
                    return res.send({message: 'Habitaciones encontradas:', rooms});
                }
            }}    
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error obteniendo las habitaciones' });
    }
}