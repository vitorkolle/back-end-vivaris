import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const selectAllPayments = async () => {
 
};

export async function createPayment(intent_payment_id:string| null, consultaId:number){
    try {
        
        const payment = await prisma.tbl_pagamentos.create({
            data: {
                intent_payment_id: intent_payment_id,
                id_consulta: consultaId,
                is_paid: true
            },
        });

        return payment;
        
    } catch (error) {
        console.error(error);
        throw new Error('Error creating payment');
    }
 };




module.exports = {
  selectAllPayments,
  createPayment,
};