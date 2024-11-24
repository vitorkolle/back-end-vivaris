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
exports.criarDisponibilidade = criarDisponibilidade;
exports.listarDisponibilidadesPorProfissional = listarDisponibilidadesPorProfissional;
exports.criarDisponibilidadeProfissional = criarDisponibilidadeProfissional;
exports.buscarDisponibilidadePsicologo = buscarDisponibilidadePsicologo;
exports.buscarDisponibilidade = buscarDisponibilidade;
exports.deletarDisponibilidade = deletarDisponibilidade;
exports.atualizarDisponibilidade = atualizarDisponibilidade;
exports.atualizarDisponibilidadeProfissional = atualizarDisponibilidadeProfissional;
exports.buscarDisponibilidadePsicologoById = buscarDisponibilidadePsicologoById;
exports.deletarDisponibilidadeByHour = deletarDisponibilidadeByHour;
exports.buscarDisponibilidadeByHourAndWeekDay = buscarDisponibilidadeByHourAndWeekDay;
const client_1 = require("@prisma/client");
const config_1 = require("../../../../module/config");
const prisma = new client_1.PrismaClient();
function criarDisponibilidade(disponibilidade) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let disponibilidadeExistente = yield prisma.tbl_disponibilidade.findFirst({
                where: {
                    dia_semana: disponibilidade.dia_semana,
                    horario_inicio: disponibilidade.horario_inicio,
                    horario_fim: disponibilidade.horario_fim,
                },
            });
            let newAvailability;
            if (!disponibilidadeExistente) {
                newAvailability = yield prisma.tbl_disponibilidade.create({
                    data: {
                        dia_semana: disponibilidade.dia_semana,
                        horario_inicio: disponibilidade.horario_inicio,
                        horario_fim: disponibilidade.horario_fim,
                    },
                });
            }
            else {
                newAvailability = disponibilidadeExistente;
            }
            return newAvailability;
        }
        catch (error) {
            console.error("Erro ao criar nova disponibilidade:", error);
            throw new Error("Não foi possível criar a dipsonibilidade.");
        }
    });
}
function listarDisponibilidadesPorProfissional(profissionalId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const usuario = yield prisma.tbl_psicologos.findUnique({
                where: {
                    id: profissionalId,
                },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    telefone: true,
                },
            });
            if (!usuario) {
                const response = {
                    id: null,
                    nome: null,
                    email: null,
                    telefone: null,
                    disponibilidades: config_1.ERROR_NOT_FOUND_AVAILBILITY.message,
                    message: config_1.ERROR_NOT_FOUND_PROFESSIONAL.message
                };
                return response;
            }
            const disponibilidades = yield prisma.tbl_psicologo_disponibilidade.findMany({
                where: {
                    psicologo_id: profissionalId,
                },
                include: {
                    tbl_disponibilidade: {
                        select: {
                            id: true,
                            dia_semana: true,
                            horario_inicio: true,
                            horario_fim: true
                        },
                    },
                },
            });
            if (disponibilidades.length < 1) {
                const response = {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    telefone: usuario.telefone,
                    disponibilidades: config_1.ERROR_NOT_FOUND_AVAILBILITY.message
                };
                return response;
            }
            else {
                const response = {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                    telefone: usuario.telefone,
                    disponibilidades: disponibilidades.map((disp) => ({
                        id: disp.tbl_disponibilidade.id,
                        dia_semana: disp.tbl_disponibilidade.dia_semana,
                        horario_inicio: disp.tbl_disponibilidade.horario_inicio,
                        horario_fim: disp.tbl_disponibilidade.horario_fim
                    })),
                };
                return response;
            }
        }
        catch (error) {
            console.error("Erro ao obter disponibilidade", error);
            throw new Error("Não foi possível obter o psicólogo com as disponibilidades.");
        }
    });
}
function criarDisponibilidadeProfissional(profissionalId, disponibilidade, status) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.tbl_psicologo_disponibilidade.create({
                data: {
                    psicologo_id: profissionalId,
                    disponibilidade_id: disponibilidade,
                    status_disponibilidade: status,
                },
            });
            const usuario = yield prisma.tbl_psicologos.findUnique({
                where: {
                    id: profissionalId,
                },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    telefone: true,
                    cpf: true,
                    data_nascimento: true,
                    foto_perfil: true,
                    cip: true,
                    link_instagram: true,
                    tbl_sexo: {
                        select: {
                            id: true,
                            sexo: true
                        }
                    },
                    preco: true
                },
            });
            if (!usuario) {
                throw new Error('Usuário não encontrado.');
            }
            const disponibilidades = yield prisma.tbl_psicologo_disponibilidade.findMany({
                where: {
                    psicologo_id: profissionalId,
                },
                include: {
                    tbl_disponibilidade: {
                        select: {
                            id: true,
                            dia_semana: true,
                            horario_inicio: true,
                            horario_fim: true,
                        },
                    },
                },
            });
            if (!disponibilidades) {
                throw new Error('Nenhuma disponibilidade encontrada.');
            }
            const response = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                disponibilidades: disponibilidades.map((disp) => ({
                    id: disp.tbl_disponibilidade.id,
                    dia_semana: disp.tbl_disponibilidade.dia_semana,
                    from: disp.tbl_disponibilidade.horario_inicio,
                    to: disp.tbl_disponibilidade.horario_fim,
                    status: disp.status_disponibilidade,
                })),
            };
            return response;
        }
        catch (error) {
            console.error("Erro ao gravar disponibilidade do profissional:", error);
            throw new Error("Não foi possível gravar as disponibilidades do profissional.");
        }
    });
}
function buscarDisponibilidadePsicologo(availabilityData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const disponibilidadePsicologo = yield prisma.tbl_psicologo_disponibilidade.findMany({
                where: {
                    psicologo_id: availabilityData.id_psicologo,
                    disponibilidade_id: availabilityData.disponibilidade_id
                },
                select: {
                    psicologo_id: true,
                    disponibilidade_id: true,
                    status_disponibilidade: true
                }
            });
            if (disponibilidadePsicologo.length > 0) {
                return disponibilidadePsicologo;
            }
            else
                return false;
        }
        catch (error) {
            console.error("Erro ao encontrar disponibilidade de psicólogos:", error);
            throw new Error("Não foi possível achar disponibilidades");
        }
    });
}
function buscarDisponibilidade(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let availability = yield prisma.tbl_disponibilidade.findMany({
                where: {
                    id: id
                },
                select: {
                    dia_semana: true,
                    horario_inicio: true,
                    horario_fim: true
                }
            });
            if (availability.length < 1) {
                return false;
            }
            return availability;
        }
        catch (error) {
            console.error("Erro ao encontrar disponibilidade:", error);
            throw new Error("Não foi possível achar disponibilidades");
        }
    });
}
function deletarDisponibilidade(diaSemana, idPsicologo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let sql = `CALL deleteDisp("${diaSemana}", ${idPsicologo})`;
            let user = yield prisma.$queryRawUnsafe(sql);
            if (!user) {
                return false;
            }
            return true;
        }
        catch (error) {
            console.error("Erro ao deletar disponibilidade:", error);
            throw new Error("Não foi possível deletar a disponibilidade");
        }
    });
}
function atualizarDisponibilidade(availabilityData, availabilityId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updateAvaibility = yield prisma.tbl_disponibilidade.update({
                where: {
                    id: availabilityId
                },
                data: {
                    dia_semana: availabilityData.dia_semana,
                    horario_inicio: availabilityData.horario_inicio,
                    horario_fim: availabilityData.horario_fim
                }
            });
            if (!updateAvaibility) {
                return false;
            }
            return updateAvaibility;
        }
        catch (error) {
            console.error("Erro ao atualizar disponibilidade:", error);
            throw new Error("Não foi possível atualizar a disponibilidade");
        }
    });
}
function atualizarDisponibilidadeProfissional(availabilityData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updateProfessionalAvailbility = yield prisma.tbl_psicologo_disponibilidade.update({
                where: {
                    id: availabilityData.disponibilidade_id
                },
                data: {
                    status_disponibilidade: availabilityData.status
                }
            });
            if (!updateProfessionalAvailbility) {
                return false;
            }
            return updateProfessionalAvailbility;
        }
        catch (error) {
            console.error("Erro ao atualizar disponibilidade do profissional:", error);
            throw new Error("Não foi possível atualizar a disponibilidade do profissional");
        }
    });
}
function buscarDisponibilidadePsicologoById(availabilityId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const searchProfessionalAvailbility = yield prisma.tbl_psicologo_disponibilidade.findUnique({
                where: {
                    id: availabilityId
                },
                select: {
                    disponibilidade_id: true,
                    psicologo_id: true,
                    status_disponibilidade: true
                }
            });
            if (!searchProfessionalAvailbility) {
                return {
                    status_code: 404,
                    message: 'Disponibilidade não encontrada'
                };
            }
            return {
                data: searchProfessionalAvailbility,
                status_code: 200
            };
        }
        catch (error) {
            console.error("Erro ao obter disponibilidade do profissional:", error);
            throw new Error("Não foi possível obter a disponibilidade do profissional");
        }
    });
}
function deletarDisponibilidadeByHour(id_psicologo, dia_semana, horario_inicio) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let sql = `CALL deleteDispByWeekDayAndHour("${dia_semana}", '${horario_inicio}', ${id_psicologo})`;
            let availability = yield prisma.$queryRawUnsafe(sql);
            if (!availability) {
                return false;
            }
            return true;
        }
        catch (error) {
            console.error("Erro ao deletar disponibilidade do profissional:", error);
            throw new Error("Não foi possível deletar a disponibilidade do profissional");
        }
    });
}
function buscarDisponibilidadeByHourAndWeekDay(dia_semana, horario_inicio, id_psicologo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let availability = yield prisma.tbl_psicologo_disponibilidade.findMany({
                where: {
                    psicologo_id: id_psicologo
                },
                select: {
                    tbl_disponibilidade: {
                        select: {
                            dia_semana: true,
                            horario_inicio: true
                        }
                    }
                }
            });
            if (availability.length < 1) {
                return false;
            }
            let existsAvailbility = false || true;
            availability.forEach(avail => {
                if (avail.tbl_disponibilidade.dia_semana === dia_semana && avail.tbl_disponibilidade.horario_inicio === horario_inicio) {
                    existsAvailbility = true;
                }
            });
            return existsAvailbility === true;
        }
        catch (error) {
            console.error("Erro ao obter disponibilidade do profissional:", error);
            throw new Error("Não foi possível obter a disponibilidade do profissional");
        }
    });
}
