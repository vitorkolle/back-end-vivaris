import { TAppointment } from "./domain/entities/appointment-entity";
import { buscarCliente } from "./model/DAO/cliente/usuario";
import dotenv from 'dotenv';
dotenv.config();

import {Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-09-30.acacia",
});

export const makePayment = async (data: TAppointment, id_cliente:number) => {
  try {
    let usuario = await buscarCliente(id_cliente)

    const customer = await stripe.customers.create({
      metadata:{
        userId: String(usuario?.id),
        consultaId: String(data.id)
      }
    })


    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'brl', 
            product_data: {
                name: 'Consulta Terapêutica - Individual',
            },
            unit_amount: data.valor * 100, 
        },
        quantity: 1,
        },
      ],
      mode: 'payment',
      payment_method_types: ['card'],
      customer: customer.id,
      success_url: `http://localhost:5173/success.html`,
      cancel_url: `http://localhost:5173/canceled.html`,
      metadata: {
        userId: String(usuario?.id),
        consultaId: String(data.id)
    },
    });

  
    return {url: session.url}
    
  } catch (error) {
    return error
  }
 
};