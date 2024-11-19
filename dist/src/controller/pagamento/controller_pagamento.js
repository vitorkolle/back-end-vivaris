"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmPayment = exports.createPaymentIntent = void 0;
const config_1 = require("../../../module/config");
const consulta_1 = require("../../model/DAO/consulta/consulta");
const pagamento_1 = require("../../model/DAO/pagamento/pagamento");
const stripe_1 = require("../../stripe");
const createPaymentIntent = (idConsulta, id_cliente) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dadosConsulta = yield (0, consulta_1.selectAppointment)(idConsulta);
        const result = yield (0, stripe_1.makePayment)(dadosConsulta, id_cliente);
        return {
            result: result,
            status_code: 200
        };
    }
    catch (error) {
        return {
            result: error,
            status_code: 400
        };
    }
});
exports.createPaymentIntent = createPaymentIntent;
const confirmPayment = (order) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!order)
            return;
        const { consultaId, paymentMethod, currentDateTimeFormatted } = extractPaymentInfo(order);
        if (isMissingRequiredFields(consultaId, paymentMethod, currentDateTimeFormatted)) {
            return config_1.ERROR_REQUIRED_FIELDS;
        }
        let paymentMethodId = getPaymentMethodId(paymentMethod);
        if (paymentMethodId === null) {
            return config_1.ERROR_INVALID_PAYMENT_METHOD_ID;
        }
        const payment = yield (0, pagamento_1.createPayment)(order.payment_intent, consultaId);
        return { received: true, pagamento: payment };
    }
    catch (error) {
        return false;
    }
});
exports.confirmPayment = confirmPayment;
const extractPaymentInfo = (event) => {
    const consultaId = isNaN(Number(event.metadata.consultaId)) ? 1 : Number(event.metadata.consultaId);
    const paymentMethod = event.payment_method_types[0];
    const currentDateTime = new Date();
    const currentDateTimeFormatted = currentDateTime.toISOString().replace('T', ' ').slice(0, 19);
    return { consultaId, paymentMethod, currentDateTimeFormatted };
};
const isMissingRequiredFields = (consultaId, paymentMethod, currentDateTimeFormatted) => {
    return (consultaId === undefined || consultaId === null || isNaN(consultaId) ||
        paymentMethod === "" || paymentMethod === undefined || paymentMethod === null ||
        currentDateTimeFormatted === "" || currentDateTimeFormatted === undefined || currentDateTimeFormatted === null || currentDateTimeFormatted.length > 19);
};
const getPaymentMethodId = (paymentMethod) => {
    if (paymentMethod === "card") {
        return 1;
    }
    return null;
};
