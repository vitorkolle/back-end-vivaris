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
exports.makePayment = void 0;
exports.handlePayment = handlePayment;
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-09-30.acacia",
});
function handlePayment(event, sig) {
    return __awaiter(this, void 0, void 0, function* () {
        event = stripe.webhooks.constructEvent(event, sig, process.env.STRIPE_ENDPOINT_SECRET);
        switch (event.type) {
            case "checkout.session.completed":
                const paymentIntentSucceeded = event.data.object;
                const data = yield stripe.customers.retrieve(paymentIntentSucceeded.customer).then((customer) => __awaiter(this, void 0, void 0, function* () {
                    if (typeof customer.deleted != 'boolean') {
                        return { paymentIntentSucceeded, customer };
                    }
                }));
                return data;
        }
    });
}
;
const makePayment = (data, id_cliente) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let usuario = id_cliente;
        const customer = yield stripe.customers.create({
            metadata: {
                userId: String(usuario),
                consultaId: String(data.id)
            }
        });
        const session = yield stripe.checkout.sessions.create({
            line_items: [
                {
                    price: 'price_1QFLpvDSzwYL8uNxEgBISYdF',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            payment_method_types: ['card'],
            customer: customer.id,
            success_url: `http://localhost:5501/success.html`,
            cancel_url: `http://localhost:5501/canceled.html`,
        });
        console.log(session);
        return { url: session.url };
    }
    catch (error) {
        return error;
    }
});
exports.makePayment = makePayment;
