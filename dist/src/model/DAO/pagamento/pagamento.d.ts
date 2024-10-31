import { TWebhookEvent } from "../../../domain/entities/stripe-event-entity";
export declare function createPayment(dados: TWebhookEvent, intent_payment_id: string, consultaId: number): Promise<{
    id: number;
    id_cartao: number;
    is_paid: boolean;
    intent_payment_id: string | null;
    id_consulta: number;
}>;
