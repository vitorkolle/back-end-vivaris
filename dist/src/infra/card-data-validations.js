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
exports.verificacao = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.verificacao = {
    verificarCvcCartao: (cvc) => __awaiter(void 0, void 0, void 0, function* () {
        const card = yield prisma.tbl_cartoes.findUnique({
            where: {
                cvc: cvc
            }
        });
        return card === null;
    }),
    verificarNumeroCartao: (numeroCartao) => __awaiter(void 0, void 0, void 0, function* () {
        const card = yield prisma.tbl_cartoes.findUnique({
            where: {
                numero_cartao: numeroCartao
            }
        });
        return card === null;
    }),
    verificarCartaoExistente: (cardData) => __awaiter(void 0, void 0, void 0, function* () {
        const card = yield prisma.tbl_cartoes.findUnique({
            where: {
                numero_cartao: cardData.numero_cartao,
                cvc: cardData.cvc
            }
        });
        if (card) {
            return {
                modalidade: card.modalidade,
                numero_cartao: card.numero_cartao,
                nome: card.nome,
                validade: card.validade,
                cvc: card.cvc
            };
        }
        return null;
    })
};
