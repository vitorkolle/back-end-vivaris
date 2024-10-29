const message = require('../module/config.ts')
import { TWebhookEvent } from "../../domain/entities/stripe-event-entity.ts";
import { selectAppointment } from "../../model/DAO/consulta/consulta.ts";
import { createPayment } from "../../model/DAO/pagamento/pagamento.ts";
import { handlePayment, makePayment } from "../../stripe.ts";

export const createPaymentIntent = async (idConsulta:number, id_cliente:number) => {

    try {
        const dadosConsulta = await selectAppointment(idConsulta)

        console.log(idConsulta)

        const result = await makePayment(dadosConsulta, id_cliente);

        return {
            result: result,
            status_code: 200
        };

    } catch (error) {
        console.log(error);
        return {
            result: error,
            status_code: 400
        };
    }
};

export const confirmPayment = async (order:TWebhookEvent, sig:string|string[]|undefined) => {
    try {
        const event = await handlePayment(order, sig);
        if (!event) return;

        const { consultaId, paymentMethod, currentDateTimeFormatted } = extractPaymentInfo(event);

        if (isMissingRequiredFields(consultaId, paymentMethod, currentDateTimeFormatted )) {
            return message.ERROR_REQUIRED_FIELDS;
        }

        const paymentMethodId = getPaymentMethodId(paymentMethod);
        if (paymentMethodId === null) {
            return message.ERROR_INVALID_PAYMENT_METHOD_ID;
        } else{
            event.forma_pagamento_id = paymentMethodId
        }

        const payment = await createPayment(event, event.paymentIntentSucceeded.payment_intent, );
        return { received: true, pagamento: payment };
    } catch (error) {
       
        return false;
    }
};

const extractPaymentInfo = (event:TWebhookEvent) => {
    const consultaId = Number(event.data.object.metadata.consultaId);
    const paymentMethod = event.data.object.payment_method_types[0];
    const currentDateTime = new Date();
    const currentDateTimeFormatted = currentDateTime.toISOString().replace('T',' ').slice(0, 19);

    return {consultaId, paymentMethod, currentDateTimeFormatted};
};

const isMissingRequiredFields = (consultaId:number, paymentMethod:string, currentDateTimeFormatted:string) => {
    return (
        consultaId === undefined || consultaId === null || isNaN(consultaId) ||
        paymentMethod === "" || paymentMethod === undefined || paymentMethod === null ||
        currentDateTimeFormatted === "" || currentDateTimeFormatted === undefined || currentDateTimeFormatted === null || currentDateTimeFormatted.length > 19
    );
};

const getPaymentMethodId = (paymentMethod:string) => {
    if (paymentMethod === "card") {
        return 1;
    }
    return null;
};