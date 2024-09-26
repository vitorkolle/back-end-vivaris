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
exports.criarNovoPsicologo = criarNovoPsicologo;
exports.logarPsicologo = logarPsicologo;
exports.buscarPsicologo = buscarPsicologo;
const client_1 = require("@prisma/client");
const config_1 = require("../../../../module/config");
const prisma = new client_1.PrismaClient();
function criarNovoPsicologo(userInput) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield prisma.tbl_psicologos.create({
                data: {
                    nome: userInput.nome,
                    email: userInput.email,
                    senha: userInput.senha,
                    telefone: userInput.telefone,
                    cpf: userInput.cpf,
                    data_nascimento: userInput.data_nascimento,
                    cip: userInput.cip,
                    id_sexo: userInput.id_sexo
                },
            });
            return user;
        }
        catch (error) {
            console.error("Erro ao criar novo profissional:", error);
            throw new Error("Não foi possível criar o profissional.");
        }
    });
}
function logarPsicologo(email, senha) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield prisma.tbl_psicologos.findUnique({
                where: {
                    email: email,
                    senha: senha
                },
                select: {
                    id: true,
                    nome: true,
                    telefone: true,
                    data_nascimento: true,
                    foto_perfil: true,
                    cip: true,
                    email: true,
                    link_instagram: true,
                    tbl_sexo: {
                        select: {
                            id: true,
                            sexo: true
                        }
                    }
                }
            });
            if (!user) {
                return Promise.resolve(config_1.ERROR_NOT_FOUND);
            }
            return user;
        }
        catch (error) {
            console.error("Erro ao obter o usuário", error);
            throw new Error("Não foi possível obter o usuário");
        }
    });
}
function buscarPsicologo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const professional = yield prisma.tbl_psicologos.findUnique({
                where: {
                    id: id
                },
                select: {
                    nome: true,
                    data_nascimento: true,
                    cip: true,
                    cpf: true,
                    telefone: true
                }
            });
            if (professional) {
                return professional;
            }
            return Promise.resolve(config_1.ERROR_NOT_FOUND);
        }
        catch (error) {
            console.error("Erro ao obter o usuário", error);
            throw new Error("Não foi possível obter o usuário");
        }
    });
}
