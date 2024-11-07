import { TAppointment } from "./domain/entities/appointment-entity";
import { TWebhookEvent } from "./domain/entities/stripe-event-entity";
import { buscarCartaoPorCliente } from "./model/DAO/cartao/cartao";
import { buscarCliente } from "./model/DAO/cliente/usuario";
import dotenv from 'dotenv';
dotenv.config();

import {Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-09-30.acacia",
});

export async function handlePayment(eventData:TWebhookEvent, sig:string|string[]|undefined){
  const event =  stripe.webhooks.constructEvent(
    eventData,
    sig,
    process.env.STRIPE_ENDPOINT_KEY
  );

  console.log("evento: ", event);
  

  switch (event.type) {
    case "checkout.session.completed":
      const paymentIntentSucceeded =  event.data.object;

      const data = await stripe.customers.retrieve(paymentIntentSucceeded.customer).then(async (customer: { deleted: any; }) => {
        if(typeof customer.deleted != 'boolean'){
          return {paymentIntentSucceeded, customer}
        }
      })

      return data;

  }
};


export const  makePayment = async (data: TAppointment, id_cliente:number) => {
  try {
    let usuario = await buscarCliente(id_cliente)

    let cartao = await buscarCartaoPorCliente(id_cliente)
    
    const customer = await stripe.customers.create({
      metadata:{
        userId: String(usuario?.id),
        consultaId: String(data.id),
        cartaoId: String(cartao?.[0]?.id_cartao ?? 1)
      }
    })


    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1QFyxxDPGGolWeU070Q7dIan',
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_method_types: ['card'],
      customer: customer.id,
      success_url: `http://localhost:5501/success.html`,
      cancel_url: `http://localhost:5501/canceled.html`,
    });
  
    return {url: session.url}
    
  } catch (error) {
    return error
  }
 
};