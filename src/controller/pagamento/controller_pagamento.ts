import { ERROR_REQUIRED_FIELDS, ERROR_INVALID_PAYMENT_METHOD_ID } from "../../../module/config";
import { selectAppointment } from "../../model/DAO/consulta/consulta";
import { createPayment } from "../../model/DAO/pagamento/pagamento";
import { makePayment } from "../../stripe";

export const createPaymentIntent = async (idConsulta:number, id_cliente:number) => {

    try {
        const dadosConsulta = await selectAppointment(idConsulta)
        
        const result = await makePayment(dadosConsulta, id_cliente);

        return {
            result: result,
            status_code: 200
        };

    } catch (error) {
        return {
            result: error,
            status_code: 400
        };
    }
};

export const confirmPayment = async (order:any) => {
    try {
    
        if (!order) return;

        const { consultaId, paymentMethod, currentDateTimeFormatted } = extractPaymentInfo(order);
        
        
        if (isMissingRequiredFields(consultaId, paymentMethod, currentDateTimeFormatted )) {
            return ERROR_REQUIRED_FIELDS;
        }

        let paymentMethodId = getPaymentMethodId(paymentMethod);
        
        if (paymentMethodId === null) {
            return ERROR_INVALID_PAYMENT_METHOD_ID;
        } 
        
        const payment = await createPayment(order.payment_intent, consultaId );
        
        return { received: true, pagamento: payment };
    } catch (error) {
       
        return false;
    }
};

const extractPaymentInfo = (event:any) => {
    const consultaId = isNaN(Number(event.metadata.consultaId)) ? 1 : Number(event.metadata.consultaId);
    const paymentMethod = event.payment_method_types[0];
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