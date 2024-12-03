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
exports.setAtualizarDiario = setAtualizarDiario;
exports.setDeletarDiario = setDeletarDiario;
exports.getBuscarDiario = getBuscarDiario;
const config_1 = require("../../../module/config");
const zod_validations_1 = require("../../infra/zod-validations");
const usuario_1 = require("../../model/DAO/cliente/usuario");
const diario_1 = require("../../model/DAO/diario/diario");
const controller_emocoes_1 = require("../emocoes/controller_emocoes");
function setAtualizarDiario(diarioInput, id, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (String(contentType).toLowerCase() !== "application/json") {
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
            if (!diarioInput.anotacoes || diarioInput.anotacoes.length > 2500 ||
                !diarioInput.data_diario || !transformarData(diarioInput.data_diario.toString()) ||
                !diarioInput.id_humor || !(0, zod_validations_1.isValidId)(diarioInput.id_humor) ||
                !diarioInput.id_cliente || !(0, zod_validations_1.isValidId)(diarioInput.id_cliente) || !(0, zod_validations_1.isValidId)(id)) {
                return config_1.ERROR_REQUIRED_FIELDS;
            }
            let validateMood = yield (0, controller_emocoes_1.getBuscarEmocao)(diarioInput.id_humor);
            if (!validateMood) {
                return config_1.ERROR_NOT_FOUND_EMOTION;
            }
            let validateClient = yield (0, usuario_1.buscarCliente)(diarioInput.id_cliente);
            if (!validateClient) {
                return config_1.ERROR_NOT_FOUND_CLIENT;
            }
            const inputDiary = {
                anotacoes: diarioInput.anotacoes,
                data_diario: transformarData(diarioInput.data_diario.toString()),
                id_cliente: diarioInput.id_cliente,
                id_humor: diarioInput.id_humor
            };
            let updateDiary = yield (0, diario_1.updateDiario)(inputDiary, id);
            if (!updateDiary) {
                return config_1.ERROR_NOT_UPDATED;
            }
            return {
                status_code: 200,
                data: updateDiary
            };
        }
        catch (error) {
            console.error("Erro ao atualizar diario:", error);
            throw new Error("Erro ao atualizar diario");
        }
    });
}
function setDeletarDiario(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!id || !(0, zod_validations_1.isValidId)(id)) {
                return config_1.ERROR_INVALID_ID;
            }
            let deleteDiary = yield (0, diario_1.deleteDiario)(id);
            if (!deleteDiary) {
                return config_1.ERROR_NOT_DELETED;
            }
            return {
                status_code: 200,
                message: config_1.SUCCESS_DELETED_ITEM.message
            };
        }
        catch (error) {
            console.error("Erro ao deletar diario:", error);
            throw new Error("Erro ao deletar diario");
        }
    });
}
function getBuscarDiario(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!id || !(0, zod_validations_1.isValidId)(id)) {
                return config_1.ERROR_INVALID_ID;
            }
            let getDiary = yield (0, diario_1.buscarDiario)(id);
            if (!getDiary) {
                return config_1.ERROR_NOT_FOUND;
            }
            return {
                status_code: 200,
                data: getDiary
            };
        }
        catch (error) {
            console.error("Erro ao buscar diario:", error);
            throw new Error("Erro ao buscar diario");
        }
    });
}
