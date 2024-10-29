import { TWebhookEvent } from "../../domain/entities/stripe-event-entity.ts";
export declare const createPaymentIntent: (idConsulta: number, id_cliente: number) => Promise<unknown>;
export declare const confirmPayment: (order: TWebhookEvent, sig: string | string[] | undefined) => Promise<any>;
