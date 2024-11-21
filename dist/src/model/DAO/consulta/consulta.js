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
exports.selectAppointment = selectAppointment;
exports.createAppointment = createAppointment;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
function selectAppointment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const appointment = yield prisma.tbl_consultas.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                data_consulta: true,
                valor: true,
                avaliacao: true,
                tbl_clientes: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        telefone: true,
                        cpf: true,
                        data_nascimento: true,
                        foto_perfil: true,
                        link_instagram: true,
                        tbl_sexo: {
                            select: {
                                id: true,
                                sexo: true,
                            },
                        },
                        tbl_clientes_preferencias: {
                            select: {
                                id_clientes: true,
                                id_preferencias: true,
                                tbl_preferencias: {
                                    select: {
                                        id: true,
                                        nome: true,
                                        cor: true,
                                    }
                                },
                            },
                        },
                    }
                },
                tbl_psicologos: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        telefone: true,
                        cpf: true,
                        cip: true,
                        data_nascimento: true,
                        foto_perfil: true,
                        link_instagram: true,
                        tbl_sexo: {
                            select: {
                                id: true,
                                sexo: true,
                            },
                        },
                    },
                },
            }
        });
        if (!appointment) {
            throw new Error('Consulta não encontrada.');
        }
        return appointment;
    });
}
function createAppointment(idProfessional, idClient, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const professional = yield prisma.tbl_psicologos.findUnique({
            where: {
                id: idProfessional
            }
        });
        const appointment = yield prisma.tbl_consultas.create({
            data: {
                valor: professional.price,
                tbl_clientes: {
                    connect: {
                        id: idClient
                    }
                },
                tbl_psicologos: {
                    connect: {
                        id: idProfessional
                    }
                },
            }
        });
    });
}
