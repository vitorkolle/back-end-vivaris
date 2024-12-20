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
exports.setInserirUsuario = setInserirUsuario;
const config_1 = require("../../module/config");
const usuario_1 = require("../model/DAO/cliente/usuario");
const client_data_validation_1 = require("../infra/client-data-validation");
function setInserirUsuario(user, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (String(contentType).toLowerCase() !== 'application/json' || contentType === undefined) {
                return config_1.ERROR_CONTENT_TYPE;
            }
            if (!user) {
                return config_1.ERROR_NOT_CREATED;
            }
            function validarData(data) {
                if (data.length != 10)
                    return false;
                return true;
            }
            function transformarData(data) {
                const dataFinal = new Date(data);
                if (dataFinal) {
                    return dataFinal;
                }
                else {
                    throw new Error("Invalid date format");
                }
            }
            // Validação dos campos obrigatórios
            if (!user.nome || typeof user.nome !== 'string' ||
                !user.cpf || user.cpf.length !== 11 || !(yield client_data_validation_1.verificacao.verificarCpf(user.cpf)) ||
                !user.data_nascimento || !validarData(user.data_nascimento.toString()) ||
                !user.email || typeof user.email !== 'string' || !(yield client_data_validation_1.verificacao.verificarEmail(user.email)) ||
                !user.senha || typeof user.senha !== 'string' ||
                !user.telefone || user.telefone.length !== 11 || typeof user.telefone !== 'string' ||
                !user.id_sexo || isNaN(Number(user.id_sexo))) {
                return config_1.ERROR_REQUIRED_FIELDS;
            }
            else {
                // Preparar os dados do usuário
                const userData = {
                    nome: user.nome,
                    email: user.email,
                    senha: user.senha,
                    telefone: user.telefone,
                    cpf: user.cpf,
                    data_nascimento: transformarData(user.data_nascimento.toString()),
                    id_sexo: user.id_sexo,
                };
                // Inserir novo cliente
                const newClient = yield (0, usuario_1.criarNovoCliente)(userData);
                if (newClient) {
                    return {
                        user: newClient,
                        status_code: config_1.SUCCESS_CREATED_ITEM.status_code,
                        message: config_1.SUCCESS_CREATED_ITEM.message,
                    };
                }
                else {
                    return config_1.ERROR_INTERNAL_SERVER_DB;
                }
            }
        }
        catch (error) {
            console.error('Erro ao tentar inserir um novo usuário:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
