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
exports.getAllSexos = getAllSexos;
exports.getSexoById = getSexoById;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function getAllSexos() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sexos = yield prisma.tbl_sexo.findMany({
                select: {
                    id: true,
                    sexo: true,
                }
            });
            return sexos;
        }
        catch (error) {
            console.error("Erro acessando todos os sexos", error);
            throw error;
        }
    });
}
function getSexoById(sexoId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sexo = yield prisma.tbl_sexo.findUnique({
                where: {
                    id: sexoId,
                },
                select: {
                    id: true,
                    sexo: true,
                }
            });
            if (!sexo) {
                throw new Error("Sexo não encontrado");
            }
            return sexo;
        }
        catch (error) {
            console.error("Error acessando o sexo por ID", error);
            throw error;
        }
    });
}
