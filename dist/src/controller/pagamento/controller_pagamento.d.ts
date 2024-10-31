import { TWebhookEvent } from "../../domain/entities/stripe-event-entity";
export declare const createPaymentIntent: (idConsulta: number, id_cliente: number) => Promise<{
    result: unknown;
    status_code: number;
}>;
export declare const confirmPayment: (order: TWebhookEvent, sig: string | string[] | undefined) => Promise<any>;
