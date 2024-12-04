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
exports.criarAvaliacao = criarAvaliacao;
exports.getAvaliacoesPorPsicologo = getAvaliacoesPorPsicologo;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function criarAvaliacao(avalicacao) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let assessment = yield prisma.tbl_avaliacoes.create({
                data: {
                    texto: avalicacao.texto,
                    avaliacao: avalicacao.avaliacao,
                    id_cliente: avalicacao.id_cliente,
                    id_psicologo: avalicacao.id_psicologo
                }
            });
            if (!assessment) {
                return false;
            }
            return assessment;
        }
        catch (error) {
            console.error("Erro ao criar nova avaliacao:", error);
            throw new Error("Não foi possível criar a avaliação");
        }
    });
}
function getAvaliacoesPorPsicologo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let assessments = yield prisma.tbl_avaliacoes.findMany({
                where: {
                    id_psicologo: id
                }
            });
            if (!assessments) {
                return [];
            }
            return assessments;
        }
        catch (error) {
            console.error("Erro ao buscar avaliacoes por psicologo:", error);
            throw new Error("Não foi possível buscar as avaliações");
        }
    });
}
