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
exports.createEmocao = createEmocao;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function createEmocao(emotionInput) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let mood = yield prisma.tbl_humor.findFirst({
                where: {
                    humor: emotionInput.emocao
                }
            });
            if (!mood) {
                return false;
            }
            let emotion = yield prisma.tbl_diario.create({
                data: {
                    data_diario: emotionInput.data,
                    id_humor: mood.id,
                    id_cliente: emotionInput.id_cliente
                },
                select: {
                    id: true,
                    data_diario: true,
                    anotacoes: true,
                    tbl_clientes: true
                }
            });
            if (!emotion) {
                return false;
            }
            return {
                id: emotion.id,
                data_diario: emotion.data_diario.toISOString().split('T')[0],
                anotacoes: emotion.anotacoes,
                humor: mood.humor,
                cliente: emotion.tbl_clientes
            };
        }
        catch (error) {
            console.error("Erro ao criar nova emocao:", error);
            throw new Error("Não foi possível criar a emocao");
        }
    });
}
