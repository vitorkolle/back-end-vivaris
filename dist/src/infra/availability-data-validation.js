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
    isDayOfWeek: (dia) => {
        const diasValidos = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"];
        return diasValidos.includes(dia);
    },
    verificarHorario: (horarioInput) => __awaiter(void 0, void 0, void 0, function* () {
        const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d$)/;
        if (!horarioRegex.test(horarioInput)) {
            return false;
        }
        return true;
    })
};
