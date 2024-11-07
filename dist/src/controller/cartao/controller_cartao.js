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
exports.setCadastrarCartao = setCadastrarCartao;
exports.getBuscarCartao = getBuscarCartao;
exports.getBuscarCartaoPorCliente = getBuscarCartaoPorCliente;
exports.setDeletarCartao = setDeletarCartao;
const config_1 = require("../../../module/config");
const card_data_validations_1 = require("../../infra/card-data-validations");
const zod_validations_1 = require("../../infra/zod-validations");
const cartao_1 = require("../../model/DAO/cartao/cartao");
function setCadastrarCartao(cardData, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (String(contentType).toLowerCase() != 'application/json') {
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
            if (!cardData.numero_cartao || !(0, zod_validations_1.isValidCardNumber)(Number(cardData.numero_cartao)) ||
                !cardData.modalidade || !(0, zod_validations_1.isValidModality)(cardData.modalidade) ||
                !cardData.nome || !(0, zod_validations_1.isValidName)(cardData.nome) ||
                !cardData.validade || !validarData(cardData.validade.toString()) || !transformarData(cardData.validade.toString()) ||
                !cardData.cvc || !(0, zod_validations_1.isValidCvc)(Number(cardData.cvc))) {
                return config_1.ERROR_REQUIRED_FIELDS;
            }
            if (!(yield card_data_validations_1.verificacao.verificarNumeroCartao(cardData.numero_cartao)) || !(yield card_data_validations_1.verificacao.verificarCvcCartao(cardData.cvc))) {
                if (card_data_validations_1.verificacao.verificarCartaoExistente(cardData) !== null) {
                    return config_1.ERROR_INVALID_CARD;
                }
            }
            const cardFinalData = {
                modalidade: cardData.modalidade,
                numero_cartao: cardData.numero_cartao,
                nome: cardData.nome,
                cvc: cardData.cvc,
                validade: transformarData(cardData.validade.toString())
            };
            let newCard = yield (0, cartao_1.cadastrarCartao)(cardFinalData);
            if (newCard) {
                return {
                    card: newCard,
                    status_code: 200
                };
            }
            return {
                card: config_1.ERROR_INTERNAL_SERVER_DB,
                status_code: 500
            };
        }
        catch (error) {
            console.error('Erro ao tentar inserir um novo cartao:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
function getBuscarCartao(cardId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, zod_validations_1.isValidId)(cardId)) {
            return config_1.ERROR_INVALID_ID;
        }
        const card = yield (0, cartao_1.buscarCartao)(cardId);
        if (card) {
            return {
                card: card,
                status_code: 200
            };
        }
        return {
            card: config_1.ERROR_NOT_FOUND.message,
            status_code: config_1.ERROR_NOT_FOUND.status_code
        };
    });
}
function getBuscarCartaoPorCliente(clientId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(0, zod_validations_1.isValidId)(clientId)) {
            return config_1.ERROR_INVALID_ID;
        }
        const cards = yield (0, cartao_1.buscarCartaoPorCliente)(clientId);
        if (cards) {
            return {
                cards: cards,
                status_code: 200
            };
        }
        return {
            cards: config_1.ERROR_NOT_FOUND.message,
            status_code: config_1.ERROR_NOT_FOUND.status_code
        };
    });
}
function setDeletarCartao(cardId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(0, zod_validations_1.isValidId)(cardId)) {
                return config_1.ERROR_INVALID_ID;
            }
            const validateId = yield getBuscarCartao(cardId);
            if (validateId.status_code === 404) {
                return config_1.ERROR_NOT_FOUND;
            }
            let deleteId = yield (0, cartao_1.deletarCartao)(cardId);
            if (deleteId) {
                return config_1.SUCCESS_DELETED_ITEM;
            }
            return config_1.ERROR_INTERNAL_SERVER_DB;
        }
        catch (error) {
            console.error('Erro ao tentar deletar um cartao:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
