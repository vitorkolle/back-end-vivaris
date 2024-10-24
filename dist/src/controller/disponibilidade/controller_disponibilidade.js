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
exports.transformarHorario = transformarHorario;
exports.setInserirDisponibilidade = setInserirDisponibilidade;
exports.criarDisponibilidadePsicologo = criarDisponibilidadePsicologo;
exports.getBuscarDisponibilidade = getBuscarDisponibilidade;
exports.getListarDisponibilidadesProfissional = getListarDisponibilidadesProfissional;
exports.setDeletarDisponibilidade = setDeletarDisponibilidade;
exports.setAtualizarDisponibilidade = setAtualizarDisponibilidade;
exports.setAtualizarDisponibilidadeProfissional = setAtualizarDisponibilidadeProfissional;
const config_1 = require("../../../module/config");
const zod_validations_1 = require("../../infra/zod-validations");
const disponibilidade_1 = require("../../model/DAO/disponibilidade/disponibilidade");
const controller_psicologo_1 = require("../usuario/controller_psicologo");
function transformarHorario(horario) {
    const hoje = new Date();
    const [horas, minutos, segundos] = horario.split(':').map(Number);
    hoje.setUTCHours(horas, minutos, segundos, 0); // Define o horário no UTC
    return hoje;
}
function setInserirDisponibilidade(disponibilidade, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (String(contentType).toLowerCase() !== 'application/json') {
                return config_1.ERROR_CONTENT_TYPE;
            }
            if (!disponibilidade) {
                return config_1.ERROR_NOT_CREATED;
            }
            // * Os horários precisam ser enviados no formato HH:MM:SS
            if (!disponibilidade.dia_semana || !(0, zod_validations_1.isValidWeekDay)(disponibilidade.dia_semana) ||
                !disponibilidade.horario_inicio || !(0, zod_validations_1.isValidHour)(disponibilidade.horario_inicio.toString()) ||
                !disponibilidade.horario_fim || !(0, zod_validations_1.isValidHour)(disponibilidade.horario_fim.toString())) {
                return config_1.ERROR_REQUIRED_FIELDS;
            }
            else {
                const disponibilidadeInput = {
                    dia_semana: disponibilidade.dia_semana,
                    horario_inicio: transformarHorario(disponibilidade.horario_inicio.toString()),
                    horario_fim: transformarHorario(disponibilidade.horario_fim.toString())
                };
                const newAvailability = yield (0, disponibilidade_1.criarDisponibilidade)(disponibilidadeInput);
                if (newAvailability) {
                    return {
                        data: newAvailability,
                        status_code: config_1.SUCCESS_CREATED_ITEM.status_code,
                        message: config_1.SUCCESS_CREATED_ITEM.message
                    };
                }
                else {
                    return config_1.ERROR_INTERNAL_SERVER_DB;
                }
            }
        }
        catch (error) {
            console.error('Erro ao tentar inserir uma nova disponibilidade:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
function criarDisponibilidadePsicologo(availability) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!availability.disponibilidade_id || !(0, zod_validations_1.isValidId)(availability.disponibilidade_id) ||
                !availability.status || typeof availability.status !== 'string' ||
                !availability.id_psicologo || !(0, zod_validations_1.isValidId)(availability.id_psicologo)) {
                return config_1.ERROR_REQUIRED_FIELDS;
            }
            const validateProfessional = yield (0, controller_psicologo_1.getBuscarPsicologo)(availability.id_psicologo);
            console.log(availability.id_psicologo, yield (0, controller_psicologo_1.getBuscarPsicologo)(availability.id_psicologo));
            if (validateProfessional.status_code === 404) {
                return config_1.ERROR_NOT_FOUND_PROFESSIONAL;
            }
            const validateAvailbility = yield getBuscarDisponibilidade(availability.disponibilidade_id);
            if (validateAvailbility.status_code === 404) {
                return config_1.ERROR_NOT_FOUND_AVAILBILITY;
            }
            const searchProfessionalAvailbility = yield (0, disponibilidade_1.buscarDisponibilidadePsicologo)(availability);
            let novaDisponibilidade;
            if (searchProfessionalAvailbility === false) {
                novaDisponibilidade = yield (0, disponibilidade_1.criarDisponibilidadeProfissional)(availability.id_psicologo, availability.disponibilidade_id, availability.status);
                if (novaDisponibilidade) {
                    return {
                        data: novaDisponibilidade,
                        status_code: config_1.SUCCESS_CREATED_ITEM.status_code,
                        message: config_1.SUCCESS_CREATED_ITEM.message
                    };
                }
                else {
                    return config_1.ERROR_INTERNAL_SERVER_DB;
                }
            }
            else {
                searchProfessionalAvailbility.forEach((searchAvailability) => __awaiter(this, void 0, void 0, function* () {
                    if (searchAvailability.id_psicologo == availability.id_psicologo && searchAvailability.disponibilidade_id == availability.disponibilidade_id) {
                        novaDisponibilidade = yield (0, disponibilidade_1.criarDisponibilidadeProfissional)(availability.id_psicologo, availability.disponibilidade_id, availability.status);
                        console.log(novaDisponibilidade);
                    }
                    else {
                        return config_1.ERROR_ALREADY_EXISTS_PREFRENCE;
                    }
                }));
            }
            if (novaDisponibilidade) {
                return {
                    data: {
                        data: novaDisponibilidade,
                        status_code: config_1.SUCCESS_CREATED_ITEM.status_code,
                        message: config_1.SUCCESS_CREATED_ITEM.message
                    }
                };
            }
            else {
                return config_1.ERROR_ALREADY_EXISTS_PROFESSIONAL_AVAILBILITY;
            }
        }
        catch (error) {
            console.error('Erro ao tentar criar a disponibilidade:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
function getBuscarDisponibilidade(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(0, zod_validations_1.isValidId)(id)) {
                return config_1.ERROR_REQUIRED_FIELDS;
            }
            let availabilityData = yield (0, disponibilidade_1.buscarDisponibilidade)(id);
            if (availabilityData === false) {
                return {
                    status_code: config_1.ERROR_NOT_FOUND.status_code,
                    data: config_1.ERROR_NOT_FOUND
                };
            }
            return {
                status_code: 200,
                data: availabilityData
            };
        }
        catch (error) {
            console.error('Erro ao tentar buscar a disponibilidade:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
function getListarDisponibilidadesProfissional(idProfessional) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(0, zod_validations_1.isValidId)(idProfessional)) {
                return config_1.ERROR_REQUIRED_FIELDS;
            }
            let availabilityProfessionalData = yield (0, disponibilidade_1.listarDisponibilidadesPorProfissional)(idProfessional);
            if (availabilityProfessionalData.id !== false) {
                return {
                    data: availabilityProfessionalData,
                    status_code: 200
                };
            }
            else
                return {
                    data: config_1.ERROR_NOT_FOUND.message,
                    status_code: 404
                };
        }
        catch (error) {
            console.error('Erro ao tentar consultar as disponibilidades por psicólogo:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
function setDeletarDisponibilidade(diaSemana, idPsicologo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(0, zod_validations_1.isValidWeekDay)(diaSemana) || !(0, zod_validations_1.isValidId)(idPsicologo)) {
                return config_1.ERROR_REQUIRED_FIELDS;
            }
            let deleteAvailbility = yield (0, disponibilidade_1.deletarDisponibilidade)(diaSemana, idPsicologo);
            console.log(deleteAvailbility);
            if (deleteAvailbility === false) {
                return config_1.ERROR_NOT_DELETED;
            }
            return config_1.SUCCESS_DELETED_ITEM;
        }
        catch (error) {
            console.error('Erro ao tentar deletar as disponibilidades:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
function setAtualizarDisponibilidade(availabilityData, contentType, availabilityId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (String(contentType).toLowerCase() !== 'application/json') {
                return config_1.ERROR_CONTENT_TYPE;
            }
            if (!(0, zod_validations_1.isValidId)(availabilityId)) {
                return config_1.ERROR_INVALID_ID;
            }
            const existsAvailbility = yield (0, disponibilidade_1.buscarDisponibilidade)(availabilityId);
            if (!existsAvailbility) {
                return config_1.ERROR_NOT_FOUND;
            }
            // * Os horários precisam ser enviados no formato HH:MM:SS
            if (!availabilityData.dia_semana || !(0, zod_validations_1.isValidWeekDay)(availabilityData.dia_semana) ||
                !availabilityData.horario_inicio || !(0, zod_validations_1.isValidHour)(availabilityData.horario_inicio.toString()) ||
                !availabilityData.horario_fim || !(0, zod_validations_1.isValidHour)(availabilityData.horario_fim.toString())) {
                return config_1.ERROR_REQUIRED_FIELDS;
            }
            const disponibilidadeInput = {
                dia_semana: availabilityData.dia_semana,
                horario_inicio: transformarHorario(availabilityData.horario_inicio.toString()),
                horario_fim: transformarHorario(availabilityData.horario_fim.toString())
            };
            let updateAvaibility = yield (0, disponibilidade_1.atualizarDisponibilidade)(disponibilidadeInput, availabilityId);
            if (!updateAvaibility) {
                return {
                    status_code: config_1.ERROR_INTERNAL_SERVER_DB.status_code,
                    message: config_1.ERROR_INTERNAL_SERVER_DB.message
                };
            }
            return {
                status_code: 200,
                data: updateAvaibility
            };
        }
        catch (error) {
            console.error('Erro ao tentar atualizar as disponibilidades:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
function setAtualizarDisponibilidadeProfissional(availabilityData, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (String(contentType).toLowerCase() !== 'application/json') {
                return config_1.ERROR_CONTENT_TYPE;
            }
            console.log(availabilityData);
            if (!(0, zod_validations_1.isValidId)(availabilityData.disponibilidade_id)) {
                return config_1.ERROR_INVALID_ID;
            }
            const existsAvailbility = yield (0, disponibilidade_1.buscarDisponibilidade)(availabilityData.disponibilidade_id);
            if (!existsAvailbility) {
                return config_1.ERROR_NOT_FOUND;
            }
            if (!availabilityData.status || !(0, zod_validations_1.isValidAvailbilityStatus)(availabilityData.status) ||
                !availabilityData.id_psicologo || !(0, zod_validations_1.isValidId)(availabilityData.id_psicologo) ||
                !availabilityData.disponibilidade_id || !(0, zod_validations_1.isValidId)(availabilityData.disponibilidade_id)) {
                return config_1.ERROR_REQUIRED_FIELDS;
            }
            const existsProfessionalAvailbility = yield (0, disponibilidade_1.buscarDisponibilidadePsicologo)(availabilityData);
            if (!existsProfessionalAvailbility) {
                return config_1.ERROR_NOT_FOUND;
            }
            let updateProfessionalAvailbility = yield (0, disponibilidade_1.atualizarDisponibilidadeProfissional)(availabilityData);
            if (!updateProfessionalAvailbility) {
                return {
                    status_code: config_1.ERROR_INTERNAL_SERVER_DB.status_code,
                    message: config_1.ERROR_INTERNAL_SERVER_DB.message
                };
            }
            return {
                data: updateProfessionalAvailbility,
                status_code: 200
            };
        }
        catch (error) {
            console.error('Erro ao tentar atualizar as disponibilidades do profissional:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
