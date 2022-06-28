'use strict'

const Hotel = require('../models/hotel.model');
const { validateData, findHotel, checkDeleteHotel, checkUpdateHotel} = require('../utils/validate');

exports.testHotel = (req, res) => {
    return res.send({ message: 'Hoteles Funcionando correctamente' });
}

exports.getHoteles = async(req, res) => {
    try {
        const hotels = await Hotel.find();
        if(!hotels){
            return res.send({message: 'Hotel no existente:'});
        }else{
            return res.send({message: 'Hotel encontrado', hotels});
        }
    } catch(err){
        return res.send({ message: 'Error obteniendo los hoteles' });
    }
}

/*
exports.getHoteles = async (req, res) => {
    try {
        const userId = req.user.sub
        const hotels = await Hotel.find({ user: userId })

        if (!hotels) {
            return res.send({ message: 'Hoteles no encontrados' });
        } else {
            return res.send({ messsage: 'Hoteles encontrados:', hotels });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error obteniendo estos hoteles' });
    }
}
*/


exports.getHotel = async(req, res)=>{
    try{
        //Capturar el ID
        const hotelId = req.params.id;
        const hotel = await Hotel.findOne({_id: hotelId}).lean();
        if(!hotel){
            return res.status(400).send({message: 'Hotel no encontrado'});
        }else{
            return res.send({message: 'Hotel encontrado:', hotel});
    }
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error obteniendo el hotel'});
    }
}

exports.addHotel = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            adminHotel: req.user.sub,
            name: params.name,
            address: params.address,
            phone: params.phone,
            image: params.image,
            timesRequest: params.timesRequest
        }
        const msg = validateData(data);
        if (!msg){
            const deleteHotel = await findHotel(data.name);
           if(deleteHotel){
            return res.send({message: 'Hotel ya en uso'});
        }else{
            const hotel = new Hotel(data);
            await hotel.save();
            return res.send({message: 'Hotel creado satisfactoriamente'});   
        }
    }else{
            return res.status(400).send(msg);
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error guardando el hotel' });
    }
}


exports.deleteHotel = async(req, res)=>{
    try{
        const hotelId = req.params.id;
        const deleteHotel = await checkDeleteHotel(hotelId);
        if(deleteHotel){
            await Hotel.findOneAndDelete({_id: hotelId});
            return res.send({message: 'Hotel eliminado satisfactoriamente', deleteHotel});
        }else{
            return res.send({message: 'No se ha encontrado el hotel o ya fue eliminado'});
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error eliminando el hotel'});
    }
}

exports.updateHotel = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const params = req.body;
        const userId = req.user.sub

        const checkUserHotel = await Hotel.findOne({ _id: hotelId })
        if (checkUserHotel.adminHotel != userId) {
            return res.status(400).send({ message: 'No puedes actualizar este hotel' })
        } else {
            const checkUpdated = await checkUpdateHotel(params);
            if (!checkUpdated) {
                return res.status(400).send({ message: 'Parámetros inválidos' })
            } else {
                const updateHotel = await Hotel.findOneAndUpdate({ _id: hotelId }, params, { new: true }).lean();
                if (!updateHotel) {
                    return res.send({ message: 'No se ha podido actualizar el hotel' })
                } else {
                    return res.send({ message: 'Hotel actualizado', updateHotel })
                }
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando el hotel' });
    }
}