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
exports.cadastrarCartao = cadastrarCartao;
exports.buscarCartao = buscarCartao;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function cadastrarCartao(cardData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const card = yield prisma.tbl_cartoes.create({
                data: {
                    modalidade: cardData.modalidade,
                    numero_cartao: cardData.numero_cartao,
                    nome: cardData.nome,
                    validade: cardData.validade,
                    cvc: cardData.cvc
                },
            });
            return card;
        }
        catch (error) {
            console.error("Erro ao criar novo cliente:", error);
            throw new Error("Não foi possível criar o cliente.");
        }
    });
}
function buscarCartao(cardId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const card = yield prisma.tbl_cartoes.findUnique({
                where: {
                    id: cardId
                }
            });
            return card;
        }
        catch (error) {
            console.error("Erro ao criar novo cliente:", error);
            throw new Error("Não foi possível criar o cliente.");
        }
    });
}
