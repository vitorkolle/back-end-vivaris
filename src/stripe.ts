import { TAppointment } from "./domain/entities/appointment-entity";
import { TWebhookEvent } from "./domain/entities/stripe-event-entity";

const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-09-30.acacia",
});

export async function handlePayment(event:TWebhookEvent, sig:string|string[]|undefined){
  event =  stripe.webhooks.constructEvent(
    event,
    sig,
    process.env.STRIPE_ENDPOINT_SECRET
  );

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


export const makePayment = async (data: TAppointment, id_cliente:number) => {
  try {
    let usuario = id_cliente
    
    const customer = await stripe.customers.create({
      metadata:{
        userId: String(usuario),
        consultaId: String(data.id)
      }
    })

    const session = await stripe.checkout.sessions.create({
  
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name:"Consulta Terapêutica - Individual" ,
              images: "/img/consulta-icon.png",
            },
            unit_amount: Number(data.valor.toFixed(2)) * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_method_types: ['card'],
      customer: customer.userId,
      success_url: `http://localhost:5501/success.html`,
      cancel_url: `http://localhost:5501/canceled.html`,
    });
  
    return {url: session.url}
    
  } catch (error) {
    return error
  }
 
};