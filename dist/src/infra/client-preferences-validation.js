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
exports.verificarPreferencias = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.verificarPreferencias = {
    isValid: (preferenceId) => __awaiter(void 0, void 0, void 0, function* () {
        const preference = yield prisma.tbl_preferencias.findUnique({
            where: { id: preferenceId },
        });
        return preference === null;
    }),
    alreadyExists: (idCliente) => __awaiter(void 0, void 0, void 0, function* () {
        const preferences = yield prisma.tbl_clientes.findMany({
            where: { id: idCliente },
        });
        return preferences === null;
    })
};
