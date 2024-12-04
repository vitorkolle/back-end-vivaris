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
exports.setCadastrarAvaliacao = setCadastrarAvaliacao;
exports.getBuscarAvaliacoesPorPsicologo = getBuscarAvaliacoesPorPsicologo;
const config_1 = require("../../../module/config");
const zod_validations_1 = require("../../infra/zod-validations");
const avaliacao_1 = require("../../model/DAO/avaliacao/avaliacao");
const usuario_1 = require("../../model/DAO/cliente/usuario");
const usuario_2 = require("../../model/DAO/psicologo/usuario");
function setCadastrarAvaliacao(avaliacao, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (String(contentType) !== "application/json") {
                return config_1.ERROR_CONTENT_TYPE;
            }
            if (!avaliacao.avaliacao || !(0, zod_validations_1.isValidAssessment)(avaliacao.avaliacao) ||
                !avaliacao.texto ||
                !avaliacao.id_cliente || !(0, zod_validations_1.isValidId)(avaliacao.id_cliente) ||
                !avaliacao.id_psicologo || !(0, zod_validations_1.isValidId)(avaliacao.id_psicologo)) {
                return config_1.ERROR_REQUIRED_FIELDS;
            }
            let validateProfessional = yield (0, usuario_2.buscarPsicologo)(avaliacao.id_psicologo);
            if (!validateProfessional) {
                return config_1.ERROR_NOT_FOUND_PROFESSIONAL;
            }
            let validateClient = yield (0, usuario_1.buscarCliente)(avaliacao.id_cliente);
            if (!validateClient) {
                return config_1.ERROR_NOT_FOUND_CLIENT;
            }
            let createAssessment = yield (0, avaliacao_1.criarAvaliacao)(avaliacao);
            if (!createAssessment) {
                return {
                    message: config_1.ERROR_NOT_CREATED.message,
                    status_code: config_1.ERROR_NOT_CREATED.status_code
                };
            }
            else {
                return {
                    data: createAssessment,
                    status_code: 201
                };
            }
        }
        catch (error) {
            console.error('Erro ao tentar inserir uma nova avaliação:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
function getBuscarAvaliacoesPorPsicologo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(0, zod_validations_1.isValidId)(id)) {
                return config_1.ERROR_REQUIRED_FIELDS;
            }
            let assessmentData = yield (0, avaliacao_1.getAvaliacoesPorPsicologo)(id);
            if (assessmentData) {
                return {
                    data: assessmentData,
                    status_code: 200
                };
            }
            return config_1.ERROR_NOT_FOUND;
        }
        catch (error) {
            console.error('Erro ao tentar buscar as avaliações de um psicologo:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
