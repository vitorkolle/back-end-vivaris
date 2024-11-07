import { TAppointment } from "./domain/entities/appointment-entity";
import { TWebhookEvent } from "./domain/entities/stripe-event-entity";
import { Stripe } from "stripe";
export declare function handlePayment(eventData: TWebhookEvent, sig: string | string[] | undefined): Promise<{
    paymentIntentSucceeded: Stripe.Checkout.Session;
    customer: {
        deleted: any;
    };
} | undefined>;
export declare const makePayment: (data: TAppointment, id_cliente: number) => Promise<unknown>;
