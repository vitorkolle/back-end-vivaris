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
const config_1 = require("../../../module/config");
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
            if (
            //  !cardData.numero_cartao || !isValidCardNumber(cardData.numero_cartao) || !await verificacao.verificarNumeroCartao(cardData.numero_cartao) ||
            !cardData.modalidade || !(0, zod_validations_1.isValidModality)(cardData.modalidade) ||
                !cardData.nome || !(0, zod_validations_1.isValidName)(cardData.nome)
            //  !cardData.validade      || !validarData(cardData.validade.toString()) || !transformarData(cardData.validade.toString()) ||
            //  !cardData.cvc           || !isValidCvc(cardData.cvc)                  || !await verificacao.verificarCvcCartao(cardData.cvc)
            ) {
                return config_1.ERROR_REQUIRED_FIELDS;
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