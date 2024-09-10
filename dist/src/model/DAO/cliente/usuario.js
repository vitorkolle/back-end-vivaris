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
exports.criarNovoCliente = criarNovoCliente;
exports.obterUsuarioComPreferencias = obterUsuarioComPreferencias;
exports.criarPreferenciasUsuario = criarPreferenciasUsuario;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function criarNovoCliente(userInput) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield prisma.tbl_clientes.create({
                data: {
                    nome: userInput.nome,
                    email: userInput.email,
                    senha: userInput.senha,
                    telefone: userInput.telefone,
                    cpf: userInput.cpf,
                    data_nascimento: userInput.data_nascimento,
                    id_sexo: userInput.id_sexo
                },
            });
            return user;
        }
        catch (error) {
            console.error("Erro ao criar novo cliente:", error);
            throw new Error("Não foi possível criar o cliente.");
        }
    });
}
function obterUsuarioComPreferencias(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 1. Obter informações do usuário
            const usuario = yield prisma.tbl_clientes.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    telefone: true,
                },
            });
            if (!usuario) {
                throw new Error('Usuário não encontrado.');
            }
            // 2. Obter as preferências associadas ao usuário
            const preferencias = yield prisma.tbl_clientes_preferencias.findMany({
                where: {
                    id_clientes: userId,
                },
                include: {
                    tbl_preferencias: {
                        select: {
                            id: true,
                            nome: true,
                            cor: true
                        },
                    },
                },
            });
            // 3. Estruturar a resposta para incluir as informações do usuário e das preferências associadas
            const response = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                preferencias: preferencias.map((pref) => {
                    var _a, _b, _c;
                    return ({
                        id: (_a = pref.tbl_preferencias) === null || _a === void 0 ? void 0 : _a.id,
                        nome: (_b = pref.tbl_preferencias) === null || _b === void 0 ? void 0 : _b.nome,
                        hexcolor: (_c = pref.tbl_preferencias) === null || _c === void 0 ? void 0 : _c.cor
                    });
                }),
            };
            return response;
        }
        catch (error) {
            console.error("Erro ao obter o usuário com as preferências:", error);
            throw new Error("Não foi possível obter o usuário com as preferências.");
        }
    });
}
function criarPreferenciasUsuario(userId, preference) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.tbl_clientes_preferencias.create({
                data: {
                    id_clientes: userId,
                    id_preferencias: preference,
                },
            });
            // 2. Obter as informações do usuário
            const usuario = yield prisma.tbl_clientes.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    telefone: true,
                },
            });
            if (!usuario) {
                throw new Error('Usuário não encontrado.');
            }
            // 3. Obter as preferências associadas ao usuário
            const preferencias = yield prisma.tbl_clientes_preferencias.findMany({
                where: {
                    id_clientes: userId,
                },
                include: {
                    tbl_preferencias: {
                        select: {
                            id: true,
                            nome: true,
                            cor: true
                        },
                    },
                },
            });
            // 4. Montar o objeto de resposta
            const response = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                preferencias: preferencias.map((pref) => {
                    var _a, _b, _c;
                    return ({
                        id: (_a = pref.tbl_preferencias) === null || _a === void 0 ? void 0 : _a.id,
                        nome: (_b = pref.tbl_preferencias) === null || _b === void 0 ? void 0 : _b.nome,
                        cor: (_c = pref.tbl_preferencias) === null || _c === void 0 ? void 0 : _c.cor
                    });
                }),
            };
            // 5. Retornar o objeto com as informações do usuário e suas preferências
            return response;
        }
        catch (error) {
            console.error("Erro ao gravar preferências do cliente:", error);
            throw new Error("Não foi possível gravar as preferências do cliente.");
        }
    });
}
