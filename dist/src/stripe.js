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
const cartao_1 = require("./model/DAO/cartao/cartao");
const usuario_1 = require("./model/DAO/cliente/usuario");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-09-30.acacia",
});
function handlePayment(event, sig) {
    return __awaiter(this, void 0, void 0, function* () {
        event = stripe.webhooks.constructEvent(event, sig, process.env.STRIPE_ENDPOINT_KEY);
        console.log("evento: ", event);
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
    var _a, _b;
    try {
        let usuario = yield (0, usuario_1.buscarCliente)(id_cliente);
        let cartao = yield (0, cartao_1.buscarCartaoPorCliente)(id_cliente);
        const customer = yield stripe.customers.create({
            metadata: {
                userId: String(usuario === null || usuario === void 0 ? void 0 : usuario.id),
                consultaId: String(data.id),
                cartaoId: String((_b = (_a = cartao === null || cartao === void 0 ? void 0 : cartao[0]) === null || _a === void 0 ? void 0 : _a.id_cartao) !== null && _b !== void 0 ? _b : 1)
            }
        });
        const session = yield stripe.checkout.sessions.create({
            line_items: [
                {
                    price: 'price_1QFyxxDPGGolWeU070Q7dIan',
                    quantity: 1,
                },
            ],
            mode: 'payment',
            payment_method_types: ['card'],
            customer: customer.id,
            success_url: `http://localhost:5501/success.html`,
            cancel_url: `http://localhost:5501/canceled.html`,
        });
        return { url: session.url };
    }
    catch (error) {
        return error;
    }
});
exports.makePayment = makePayment;
