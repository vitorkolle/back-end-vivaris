import stripe from "stripe";
export declare const createPaymentIntent: (idConsulta: number, id_cliente: number) => Promise<{
    result: unknown;
    status_code: number;
}>;
export declare const confirmPayment: (order: any) => Promise<false | {
    status: boolean;
    status_code: number;
    message: string;
} | {
    received: boolean;
    pagamento: {
        id: number;
        is_paid: boolean;
        intent_payment_id: string | null;
        id_consulta: number;
    };
} | undefined>;
export declare function processarEventoCheckout(session: stripe.Checkout.Session): Promise<void>;
