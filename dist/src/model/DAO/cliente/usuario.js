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
exports.logarCliente = logarCliente;
exports.buscarCliente = buscarCliente;
const client_1 = require("@prisma/client");
const config_1 = require("../../../../module/config");
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
            return response;
        }
        catch (error) {
            console.error("Erro ao gravar preferências do cliente:", error);
            throw new Error("Não foi possível gravar as preferências do cliente.");
        }
    });
}
function logarCliente(email, senha) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const usuario = yield prisma.tbl_clientes.findUnique({
                where: {
                    email: email,
                    senha: senha
                },
                select: {
                    id: true,
                    nome: true,
                    telefone: true,
                    data_nascimento: true,
                    foto_perfil: true
                }
            });
            console.log(usuario);
            if (!usuario) {
                return {
                    status: config_1.ERROR_NOT_FOUND.status_code,
                    message: config_1.ERROR_NOT_FOUND.message
                };
            }
            const preferencias_usuario = yield prisma.tbl_clientes_preferencias.findMany({
                where: {
                    id_clientes: usuario.id
                },
                select: {
                    id_preferencias: true,
                    id_clientes: true
                }
            });
            if (!preferencias_usuario) {
                const response = {
                    usuario: usuario,
                    status: 200,
                    message: config_1.ERROR_NOT_FOUND_PREFERENCE.message
                };
                return response;
            }
            const preferenciasArray = [];
            for (let index = 0; index < preferencias_usuario.length; index++) {
                const array = preferencias_usuario[index];
                const preferencias = yield prisma.tbl_preferencias.findMany({
                    where: {
                        id: Number(array.id_preferencias),
                    },
                    select: {
                        id: true,
                        nome: true,
                        cor: true
                    }
                });
                preferenciasArray.push(preferencias);
            }
            if (preferenciasArray.length < 1) {
                const response = {
                    usuario: usuario,
                    status: 200,
                    message: config_1.ERROR_NOT_FOUND_PREFERENCE.message
                };
                return response;
            }
            const response = {
                usuario: usuario,
                preferencias_usuario: preferenciasArray,
                status: 200
            };
            return response;
        }
        catch (error) {
            console.error("Erro ao obter o usuário", error);
            throw new Error("Não foi possível obter o usuário");
        }
    });
}
function buscarCliente(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let clientData = yield prisma.tbl_clientes.findUnique({
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    senha: true,
                    telefone: true,
                    cpf: true,
                    data_nascimento: true,
                    foto_perfil: true,
                    link_instagram: true,
                    id_sexo: true
                },
                where: {
                    id: id
                }
            });
            return clientData;
        }
        catch (error) {
            console.error("Erro ao obter o usuário", error);
            throw new Error("Não foi possível obter o usuário");
        }
    });
}
