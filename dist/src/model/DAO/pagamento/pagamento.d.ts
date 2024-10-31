import { TWebhookEvent } from "../../../domain/entities/stripe-event-entity";
export declare function createPayment(dados: TWebhookEvent, intent_payment_id: string): Promise<any>;
