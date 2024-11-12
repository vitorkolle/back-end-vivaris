export declare function createPayment(intent_payment_id: string | null, consultaId: number): Promise<{
    id: number;
    id_cartao: number;
    is_paid: boolean;
    intent_payment_id: string | null;
    id_consulta: number;
}>;
