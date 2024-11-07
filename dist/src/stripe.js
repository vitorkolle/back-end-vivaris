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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePayment = void 0;
exports.handlePayment = handlePayment;
const usuario_1 = require("./model/DAO/cliente/usuario");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe_1 = require("stripe");
const stripe = new stripe_1.Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-09-30.acacia",
});
function handlePayment(eventData) {
    return __awaiter(this, void 0, void 0, function* () {
        const checkoutSession = eventData.data.object;
        switch (eventData.type) {
            case "checkout.session.completed":
                if (checkoutSession.customer === null) {
                    const data = yield stripe.customers.retrieve(checkoutSession.customer).then((customerResponse) => {
                        if (!('deleted' in customerResponse)) {
                            return { checkoutSession, customer: customerResponse };
                        }
                        else {
                            console.error('O cliente foi deletado');
                            return null;
                        }
                    });
                    console.log(data);
                    return data;
                }
                else {
                    console.error('O customer ID não é uma string válida ou está ausente.');
                }
                break;
            default:
                console.log('Tipo de evento não tratado:', eventData.type);
                break;
        }
    });
}
;
const makePayment = (data, id_cliente) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let usuario = yield (0, usuario_1.buscarCliente)(id_cliente);
        // let cartao = await buscarCartaoPorCliente(id_cliente)
        const customer = yield stripe.customers.create({
            metadata: {
                userId: String(usuario === null || usuario === void 0 ? void 0 : usuario.id),
                consultaId: String(data.id)
            }
        });
        const session = yield stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'brl',
                        product_data: {
                            name: 'Consulta Terapêutica - Individual',
                        },
                        unit_amount: data.valor * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            payment_method_types: ['card'],
            customer: customer.id,
            success_url: `http://localhost:5501/success.html`,
            cancel_url: `http://localhost:5501/canceled.html`,
            metadata: {
                userId: String(usuario === null || usuario === void 0 ? void 0 : usuario.id),
                consultaId: String(data.id)
            },
        });
        return { url: session.url };
    }
    catch (error) {
        return error;
    }
});
exports.makePayment = makePayment;
