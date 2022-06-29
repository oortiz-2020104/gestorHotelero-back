'use strict'

const Services = require('../models/service.model');
const Hotel = require('../models/hotel.model')
const validate = require('../utils/validate');


exports.testServices = (req, res)=>{
    return res.send({message: 'Function testServices is running'});
}

exports.saveService = async(req, res)=>{
    try{

        const params = req.body;
        const data = {
            hotel: params.hotel,
            name: params.name,
            price: params.price,
            description: params.description
        }

        const msg = validate.validateData(data);
        if(msg) return res.status(400).send(msg);
        const hotelExist = await Hotel.findOne({_id: params.hotel});
        if(!hotelExist) return res.status(404).send({message: 'Hotel not found'});
        data.description = params.description;

        const service = new Services(data);
        await service.save();
        return res.send({message: 'Service saved successfully'});
    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error saving service'});
    }
}

exports.updateService = async(req, res)=>{
    try{

        const serviceId = req.params.id;
        const params = req.body;

        const checkUpdate = await validate.checkUpdateService(params);
        if(checkUpdate === false) return res.status(400).send({message: 'Not sending params to update or params cannot update'});
        const hotelExist = await Hotel.findOne({_id: params.hotel});
        if(!hotelExist) return res.send({message: 'Hotel not found'});
        const serviceUpdated = await Services.findOneAndUpdate({_id: serviceId}, params, {new: true})
        .lean();
        if(!serviceUpdated) return res.send({message: 'Service does not exist or Service not updated'});
        return res.send({message: 'Service updated successfully', serviceUpdated});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error updating service'});
    }
}


exports.getService = async(req, res)=>{
    try{
        

        const serviceId = req.params.id;
        const service = await Services.findOne({_id: serviceId})
        .lean()
        .populate('hotel');
        if(!service) return res.status(404).send({message: 'service not found'});
        return res.send({message: 'Service found:', service});

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting service'});
    }
}

exports.getServices = async(req, res)=>{
    try{

        const services = await Services.find()
        .lean()
        .populate('hotel');
        return res.send({message: 'Services found:', services})

    }catch(err){
        console.log(err);
        return res.status(500).send({err, message: 'Error getting services'});
    }
}



exports.deleteServices = async(req, res)=>{
    try{
       
        const serviceId = req.params.id;
        const serviceDeleted = await Services.findOneAndDelete({_id: serviceId})
        .lean()
        .populate('hotel');
        if(!serviceDeleted) return res.status(404).send({message: 'Service not found or already deleted'});
        return res.send({message: 'service deleted:', serviceDeleted});
        
    }catch (err){
        console.log(err);
        return res.status(500).send({err, message: 'Error deleting service'});
    }
}