'use strict'  

const { validateData} = require('../utils/validate'); 
const Bill = require('../models/bill.model'); 
const Reservation = require('../models/reservation.model'); 



exports.testBill = (req, res) => {
    return res.send({ message: 'Función de prueba desde el controlador de factura' });
} 


exports.createBill = async (req, res)=>{ 
    try {
        const params = req.body; 
        const data = { 
            total: params.total, 
            reservation: params.Reservation
        } 
        const msg = validateData(data); 
        if (!msg) {
            const findReservation = await Reservation.findOne({_id: data.reservation}); 
            if (!findReservation) {
                return res.status(404).send({ message: 'Reservación no encontrada' }); 
            } else {
                const bill = new Bill(data); 
                const billSaved = await bill.save();  
                return res.send({ message: 'This is your bill, Thanks for stay with us', billSaved, findReservation});
            }
            

        } else {
            return res.status(400).send(msg)
        } 
    } catch (error) {
        console.log(error) 
        return error;
    }
} 


exports.searchBills = async(req, res) =>{ 
    try {
        const userId = req.params.id;
        let searchBill = await Bill.find({ user: userId }).lean();
        if (searchBill.length === 0) return res.send({ message: 'there is not any bill to show'});
         else return res.send({ searchBill });
    } catch (error) {
        console.log(error) 
        return error;
    }
}