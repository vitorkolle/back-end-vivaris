export type TWebhookEvent = {
    id: string;
    object: "event";
    api_version: string;
    created: number;
    data: {
        object: {
            id: string;
            object: "setup_intent";
            application: string | null;
            automatic_payment_methods: string | null;
            cancellation_reason: string | null;
            client_secret: string;
            created: number;
            customer: string | null;
            description: string | null;
            flow_directions: string | null;
            last_setup_error: string | null;
            latest_attempt: string | null;
            livemode: boolean;
            mandate: string | null;
            metadata: Record<string, string>;
            next_action: string | null;
            on_behalf_of: string | null;
            payment_method: string;
            payment_method_options: {
                acss_debit: {
                    currency: string;
                    mandate_options: {
                        interval_description: string;
                        payment_schedule: string;
                        transaction_type: string;
                    };
                    verification_method: string;
                };
            };
            payment_method_types: string[];
            single_use_mandate: string | null;
            status: string;
            usage: string;
        };
    };
    livemode: boolean;
    pending_webhooks: number;
    request: {
        id: string | null;
        idempotency_key: string | null;
    };
    type: string;
    forma_pagamento_id: number;
};
