import { TWebhookEvent } from "../../../domain/entities/stripe-event-entity";
<<<<<<< Updated upstream
export declare function createPayment(dados: TWebhookEvent, intent_payment_id: string, consultaId: number): Promise<{
    id: number;
    id_cartao: number;
    is_paid: boolean;
    intent_payment_id: string | null;
    id_consulta: number;
}>;
=======
export declare function createPayment(dados: TWebhookEvent, intent_payment_id: string, consultaId: number): Promise<any>;
>>>>>>> Stashed changes
