import { TWebhookEvent } from "../../../domain/entities/stripe-event-entity";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const selectAllPayments = async () => {
 
};

export async function createPayment(dados:TWebhookEvent, intent_payment_id:string,){
    try {
        const payment = await prisma.tbl_pagamento.create({
            data: {
                // intent_payment_id,
                // id_consulta,
                // id_cartao,
                // dados.forma_pagamento_id,
                // is_paid
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