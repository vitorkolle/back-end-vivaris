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
exports.setCriarEmocao = setCriarEmocao;
exports.getBuscarEmocao = getBuscarEmocao;
const config_1 = require("../../../module/config");
const zod_validations_1 = require("../../infra/zod-validations");
const usuario_1 = require("../../model/DAO/cliente/usuario");
const emocoes_1 = require("../../model/DAO/emocoes/emocoes");
function setCriarEmocao(emocao, contentType) {
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
            if (!emocao.id_cliente || !(0, zod_validations_1.isValidId)(emocao.id_cliente) ||
                !emocao.data || !transformarData(String(emocao.data)) ||
                !emocao.emocao || !(0, zod_validations_1.isValidMood)(emocao.emocao)) {
                return config_1.ERROR_REQUIRED_FIELDS;
            }
            let validateClient = yield (0, usuario_1.buscarCliente)(emocao.id_cliente);
            if (!validateClient) {
                return config_1.ERROR_NOT_FOUND_CLIENT;
            }
            const inputEmocao = {
                emocao: emocao.emocao,
                data: transformarData(String(emocao.data)),
                id_cliente: emocao.id_cliente
            };
            let validateEmotion = yield (0, emocoes_1.validarEmocao)(inputEmocao);
            if (validateEmotion) {
                return config_1.ERROR_ALREADY_EXISTS_EMOTION;
            }
            let emotion = yield (0, emocoes_1.createEmocao)(inputEmocao);
            if (!emotion) {
                return config_1.ERROR_NOT_CREATED;
            }
            return {
                status_code: 201,
                data: emotion
            };
        }
        catch (error) {
            console.error("Erro ao criar nova emocao:", error);
            throw new Error("Não foi possível criar a emocao");
        }
    });
}
function getBuscarEmocao(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!id || !(0, zod_validations_1.isValidId)(id)) {
            return config_1.ERROR_INVALID_ID;
        }
        let emotion = yield (0, emocoes_1.buscarEmocao)(id);
        if (!emotion) {
            return config_1.ERROR_NOT_FOUND;
        }
        return {
            status_code: 200,
            data: emotion
        };
    });
}
