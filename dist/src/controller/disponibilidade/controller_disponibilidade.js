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
const disponibilidade_1 = require("../../model/DAO/disponibilidade/disponibilidade");
const config_1 = require("../../../module/config");
const availability_data_validation_1 = require("../../infra/availability-data-validation");
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
            if (!disponibilidade.dia_semana || disponibilidade.dia_semana.length > 7 || disponibilidade.dia_semana.length < 5 || typeof disponibilidade.dia_semana !== 'string' || !availability_data_validation_1.verificacao.isDayOfWeek(disponibilidade.dia_semana) ||
                !disponibilidade.horario_inicio || !availability_data_validation_1.verificacao.verificarHorario(disponibilidade.horario_inicio.toString()) ||
                !disponibilidade.horario_fim || !availability_data_validation_1.verificacao.verificarHorario(disponibilidade.horario_fim.toString())) {
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
            if (!availability.disponibilidade_id || typeof availability.disponibilidade_id !== 'number' || !availability.status || !availability.id_psicologo) {
                return config_1.ERROR_REQUIRED_FIELDS;
            }
            const novaDisponibilidade = yield (0, disponibilidade_1.criarDisponibilidadeProfissional)(availability.disponibilidade_id, availability.id_psicologo, availability.status);
            if (novaDisponibilidade) {
                return {
                    data: novaDisponibilidade,
                    status_code: config_1.SUCCESS_CREATED_ITEM.status_code,
                    message: config_1.SUCCESS_CREATED_ITEM.message
                };
            }
            else {
                return config_1.ERROR_INTERNAL_SERVER;
            }
        }
        catch (error) {
            console.error('Erro ao tentar criar a disponibilidade:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
