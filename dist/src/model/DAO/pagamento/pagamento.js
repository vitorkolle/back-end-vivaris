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
exports.createPayment = createPayment;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const selectAllPayments = () => __awaiter(void 0, void 0, void 0, function* () {
});
function createPayment(intent_payment_id, consultaId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payment = yield prisma.tbl_pagamentos.create({
                data: {
                    intent_payment_id: intent_payment_id,
                    id_consulta: consultaId,
                    is_paid: true
                },
            });
            return payment;
        }
        catch (error) {
            console.error(error);
            throw new Error('Error creating payment');
        }
    });
}
;
// const findByIntentPayment = async (intent_payment_id) => {
// };
module.exports = {
    selectAllPayments,
    //findByIntentPayment,
    createPayment,
};
