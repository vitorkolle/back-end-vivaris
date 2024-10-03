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
const client_1 = require("@prisma/client");
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
                return {
                    id: false
                };
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
            const response = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                disponibilidades: disponibilidades.map((disp) => {
                    var _a, _b, _c;
                    return ({
                        id: (_a = disp.tbl_disponibilidade) === null || _a === void 0 ? void 0 : _a.id,
                        dia_semana: (_b = disp.tbl_preferencias) === null || _b === void 0 ? void 0 : _b.d,
                        hexcolor: (_c = disp.tbl_preferencias) === null || _c === void 0 ? void 0 : _c.cor
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
function criarDisponibilidadeProfissional(profissionalId, disponibilidade, status) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(profissionalId, disponibilidade, status);
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
                    }
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
                console.log('oi');
            }
            const response = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                disponibilidades: disponibilidades.map((disp) => {
                    var _a, _b, _c, _d;
                    return ({
                        id: (_a = disp.tbl_disponibilidade) === null || _a === void 0 ? void 0 : _a.id,
                        dia_semana: (_b = disp.tbl_disponibilidade) === null || _b === void 0 ? void 0 : _b.dia_semana,
                        from: (_c = disp.tbl_disponibilidade) === null || _c === void 0 ? void 0 : _c.horario_inicio,
                        to: (_d = disp.tbl_disponibilidade) === null || _d === void 0 ? void 0 : _d.horario_fim,
                        status: disp.status_disponibilidade,
                    });
                }),
            };
            return response;
        }
        catch (error) {
            console.error("Erro ao gravar disponibilidade do profissional:", error);
            throw new Error("Não foi possível gravar as disponibilidades do profissional.");
        }
    });
}
function buscarDisponibilidadePsicologo(professionalId, availabilityId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const disponibilidadePsicologo = yield prisma.tbl_psicologo_disponibilidade.findMany({
                where: {
                    psicologo_id: professionalId,
                    disponibilidade_id: availabilityId
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
            let user = yield prisma.$queryRaw `CALL deleteDisp(${diaSemana}, ${idPsicologo})`;
            console.log(user);
            if (String(user).length < 1) {
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
