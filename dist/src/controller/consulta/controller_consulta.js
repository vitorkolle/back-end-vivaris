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
exports.setCadastrarConsulta = setCadastrarConsulta;
exports.getBuscarConsulta = getBuscarConsulta;
exports.setDeletarConsulta = setDeletarConsulta;
const config_1 = require("../../../module/config");
const zod_validations_1 = require("../../infra/zod-validations");
const usuario_1 = require("../../model/DAO/cliente/usuario");
const consulta_1 = require("../../model/DAO/consulta/consulta");
const usuario_2 = require("../../model/DAO/psicologo/usuario");
function setCadastrarConsulta(idProfessional, idClient, data, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (String(contentType).toLowerCase() !== 'application/json') {
                return config_1.ERROR_CONTENT_TYPE;
            }
            function validarData(data) {
                if (data.length !== 10)
                    return false;
                const partes = data.split("-");
                const ano = parseInt(partes[0], 10);
                const mes = parseInt(partes[1], 10);
                const dia = parseInt(partes[2], 10);
                if (mes < 1 || mes > 12)
                    return false;
                const dataTestada = new Date(ano, mes - 1, dia);
                return dataTestada.getFullYear() === ano && dataTestada.getMonth() === mes - 1 && dataTestada.getDate() === dia;
            }
            function transformarData(data) {
                if (!validarData(data)) {
                    throw new Error("Formato de data inválido");
                }
                return new Date(data);
            }
            if (!(0, zod_validations_1.isValidId)(idProfessional) || !(0, zod_validations_1.isValidId)(idClient) || !validarData(data.toString()) || !transformarData(data.toString())) {
                return config_1.ERROR_REQUIRED_FIELDS;
            }
            let validateClient = yield (0, usuario_1.buscarCliente)(idClient);
            if (!validateClient) {
                return config_1.ERROR_NOT_FOUND_CLIENT;
            }
            let validateProfessional = yield (0, usuario_2.buscarPsicologo)(idProfessional);
            if (!validateProfessional) {
                return config_1.ERROR_NOT_FOUND_PROFESSIONAL;
            }
            let newAppointment = yield (0, consulta_1.createAppointment)(idProfessional, idClient, transformarData(data.toString()));
            if (!newAppointment) {
                return config_1.ERROR_INTERNAL_SERVER_DB;
            }
            return {
                data: newAppointment,
                status_code: 201
            };
        }
        catch (error) {
            console.error('Erro ao tentar inserir uma nova consulta:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
function getBuscarConsulta(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, zod_validations_1.isValidId)(id)) {
            return config_1.ERROR_INVALID_ID;
        }
        let getAppointment = yield (0, consulta_1.selectAppointment)(id);
        if (!getAppointment) {
            return config_1.ERROR_NOT_FOUND;
        }
        return {
            data: getAppointment,
            status_code: 200
        };
    });
}
function setDeletarConsulta(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, zod_validations_1.isValidId)(id)) {
            return config_1.ERROR_INVALID_ID;
        }
        let appointment = yield (0, consulta_1.deleteAppointment)(id);
        if (!consulta_1.deleteAppointment) {
            return config_1.ERROR_NOT_DELETED;
        }
        return {
            data: config_1.SUCCESS_DELETED_ITEM.message,
            status_code: 200
        };
    });
}
