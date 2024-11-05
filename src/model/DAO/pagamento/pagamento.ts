import { TWebhookEvent } from "../../../domain/entities/stripe-event-entity";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const selectAllPayments = async () => {
 
};

export async function createPayment(dados:TWebhookEvent, intent_payment_id:string, consultaId:number){
<<<<<<< Updated upstream
    console.log("objeto event: ",dados.object.customer);
    
    try {
        const payment = await prisma.tbl_pagamentos.create({
            data: {
                intent_payment_id: intent_payment_id,
                id_consulta:consultaId ,
                id_cartao:dados.object.customer.metadata.cartaoId,
                is_paid:true,
=======
    try {
        console.log("pagandoo");
        
        const payment = await prisma.tbl_pagamento.create({
            data: {
                intent_payment_id: intent_payment_id,
                id_consulta: consultaId,
                id_cartao: 1,
                is_paid: true
>>>>>>> Stashed changes
            },
        });

        return payment;
        
    } catch (error) {
        console.error(error);
        throw new Error('Error creating payment');
    }
 };

// const findByIntentPayment = async (intent_payment_id) => {
// };


module.exports = {
  selectAllPayments,
  //findByIntentPayment,
  createPayment,
};