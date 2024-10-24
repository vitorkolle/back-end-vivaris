import { TAppointment } from "./domain/entities/appointment-entity";
import { TWebhookEvent } from "./domain/entities/stripe-event-entity";
export declare function handlePayment(event: TWebhookEvent, sig: string | string[] | undefined): Promise<any>;
export declare const makePayment: (data: TAppointment, id_cliente: number) => Promise<unknown>;
