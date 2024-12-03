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
const usuario_1 = require("./model/DAO/cliente/usuario");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe_1 = require("stripe");
const usuario_2 = require("./model/DAO/psicologo/usuario");
const disponibilidade_1 = require("./model/DAO/disponibilidade/disponibilidade");
const stripe = new stripe_1.Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-09-30.acacia",
});
const makePayment = (data, id_cliente) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let usuario = yield (0, usuario_1.buscarCliente)(id_cliente);
        let idPsico = yield (0, usuario_2.getIdByName)(data.tbl_psicologos.nome);
        const disponibilidadesPsicologo = yield (0, disponibilidade_1.listarDisponibilidadesPorProfissional)(Number(idPsico));
        const disponibilidadesArray = Array.isArray(disponibilidadesPsicologo.disponibilidades)
            ? disponibilidadesPsicologo.disponibilidades
            : [];
        let disponibilidadeSelecionada = null;
        function getDiaSemana(dataISO) {
            const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
            const dataObj = new Date(dataISO);
            const diaIndex = dataObj.getDay();
            return diasSemana[diaIndex];
        }
        function getHorario(dataISO) {
            const dataObj = new Date(dataISO);
            const horas = String(dataObj.getUTCHours());
            const minutos = String(dataObj.getUTCMinutes());
            return `${horas}:${minutos}`;
        }
        for (const disp of disponibilidadesArray) {
            console.log('DISP:', disp);
            const diaDisponibilidade = disp.dia_semana;
            const horarioInicio = disp.horario_inicio;
            const horarioFim = disp.horario_fim;
            const diaConsulta = getDiaSemana(data.data_consulta);
            const horarioConsulta = getHorario(data.data_consulta);
            if (diaConsulta === diaDisponibilidade &&
                horarioConsulta >= horarioInicio &&
                horarioConsulta <= horarioFim) {
                disponibilidadeSelecionada = disp;
                break;
            }
        }
        if (!disponibilidadeSelecionada) {
            throw new Error('Nenhuma disponibilidade correspondente encontrada!');
        }
        const customer = yield stripe.customers.create({
            metadata: {
                userId: String(usuario === null || usuario === void 0 ? void 0 : usuario.id),
                consultaId: String(data.id),
                disponibilidadeId: JSON.stringify(disponibilidadeSelecionada),
                psicoId: String(idPsico)
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
            success_url: `http://localhost:5173/PaymentStatus?success=true`,
            cancel_url: `http://localhost:5173/PaymentStatus?success=false`,
            metadata: {
                userId: String(usuario === null || usuario === void 0 ? void 0 : usuario.id),
                consultaId: String(data.id),
                disponibilidade: JSON.stringify(disponibilidadeSelecionada),
                psicoId: String(idPsico)
            },
        });
        return { url: session.url };
    }
    catch (error) {
        return error;
    }
});
exports.makePayment = makePayment;
