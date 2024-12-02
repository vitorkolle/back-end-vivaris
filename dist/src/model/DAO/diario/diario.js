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
exports.updateDiario = updateDiario;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function updateDiario(diaryInput, diaryId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let diary = yield prisma.tbl_diario.update({
                where: {
                    id: diaryId
                },
                data: {
                    data_diario: diaryInput.data_diario,
                    anotacoes: diaryInput.anotacoes,
                    id_humor: diaryInput.id_humor,
                    id_cliente: diaryInput.id_cliente
                },
                select: {
                    id: true,
                    data_diario: true,
                    anotacoes: true,
                    tbl_clientes: true,
                    tbl_humor: true
                }
            });
            if (!diary) {
                return false;
            }
            return diary;
        }
        catch (error) {
            console.error("Erro ao atualizar diario:", error);
            throw new Error("Erro ao atualizar diario");
        }
    });
}
