import { TAppointment } from "./domain/entities/appointment-entity";
import { Stripe } from "stripe";
export declare function handlePayment(eventData: any): Promise<{
    checkoutSession: any;
    customer: Stripe.Customer & {
        lastResponse: {
            headers: {
                [key: string]: string;
            };
            requestId: string;
            statusCode: number;
            apiVersion?: string;
            idempotencyKey?: string;
            stripeAccount?: string;
        };
    };
} | null | undefined>;
export declare const makePayment: (data: TAppointment, id_cliente: number) => Promise<unknown>;
