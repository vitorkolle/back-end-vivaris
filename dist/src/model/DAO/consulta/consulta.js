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
exports.selectAppointmentByProfessional = selectAppointmentByProfessional;
exports.createAppointment = createAppointment;
exports.deleteAppointment = deleteAppointment;
exports.updateAppointment = updateAppointment;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function selectAppointment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
                            }
                        }
                    }
                }
            });
            if (!appointment) {
                return false;
            }
            return appointment;
        }
        catch (error) {
            console.error("Erro ao buscar consulta", error);
            throw new Error("Não foi possível buscar a consulta");
        }
    });
}
function selectAppointmentByProfessional(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const appointments = yield prisma.tbl_consultas.findMany({
            where: {
                id_psicologo: id
            },
            select: {
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
                        }
                    }
                },
                tbl_psicologos: {
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        cip: true,
                        cpf: true,
                        data_nascimento: true,
                        link_instagram: true,
                        tbl_sexo: {
                            select: {
                                id: true,
                                sexo: true,
                            },
                        },
                        preco: true,
                        telefone: true,
                        foto_perfil: true
                    }
                },
                tbl_pagamentos: {
                    select: {
                        is_paid: true
                    }
                },
                data_consulta: true,
                valor: true,
                avaliacao: true,
            }
        });
        if (!appointments) {
            return false;
        }
        return appointments;
    });
}
function createAppointment(idProfessional, idClient, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const professional = yield prisma.tbl_psicologos.findUnique({
            where: {
                id: idProfessional
            }
        });
        if (!professional) {
            return false;
        }
        let avaliacao = yield prisma.$queryRawUnsafe(`call getMediaAvaliacao(${idProfessional})`);
        if (!avaliacao) {
            return false;
        }
        function formatAvaliacao(avaliacao) {
            switch (true) {
                case (avaliacao >= 1 && avaliacao < 2): return client_1.tbl_consultas_avaliacao.Um;
                case (avaliacao >= 2 && avaliacao < 3): return client_1.tbl_consultas_avaliacao.Dois;
                case (avaliacao >= 3 && avaliacao < 4): return client_1.tbl_consultas_avaliacao.Tres;
                case (avaliacao >= 4 && avaliacao < 5): return client_1.tbl_consultas_avaliacao.Quatro;
                case (avaliacao === 5): return client_1.tbl_consultas_avaliacao.Cinco;
                default: return client_1.tbl_consultas_avaliacao.Um;
            }
        }
        const appointment = yield prisma.tbl_consultas.create({
            data: {
                valor: professional.preco,
                avaliacao: formatAvaliacao(Number(avaliacao)),
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
                data_consulta: data
            }
        });
        if (!appointment) {
            return false;
        }
        const user = yield prisma.tbl_clientes.findUnique({
            where: {
                id: idClient
            }
        });
        if (!user) {
            return false;
        }
        const professionalUser = yield prisma.tbl_psicologos.findUnique({
            where: {
                id: idProfessional
            }
        });
        if (!professionalUser) {
            return false;
        }
        return {
            consulta: appointment,
            psicologo: professionalUser,
            cliente: user
        };
    });
}
function deleteAppointment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let appointment = yield prisma.tbl_consultas.delete({
                where: {
                    id: id
                }
            });
            if (!appointment) {
                return false;
            }
            return true;
        }
        catch (error) {
            console.error("Erro ao deletar consulta do profissional:", error);
            throw new Error("Não foi possível deletar a consulta do profissional");
        }
    });
}
function updateAppointment(data, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let appointment = yield prisma.tbl_consultas.update({
                where: {
                    id: id
                },
                data: {
                    data_consulta: data
                }
            });
            if (!appointment) {
                return false;
            }
            return true;
        }
        catch (error) {
            console.error("Erro ao atualizar a consulta do profissional:", error);
            throw new Error("Não foi possível atualizar a consulta do profissional");
        }
    });
}
