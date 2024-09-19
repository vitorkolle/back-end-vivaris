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
exports.setInserirPsicologo = setInserirPsicologo;
exports.getLogarPsicologo = getLogarPsicologo;
exports.getBuscarPsicologo = getBuscarPsicologo;
const config_1 = require("../../../module/config");
const professional_data_validation_1 = require("../../infra/professional-data-validation");
const usuario_1 = require("../../model/DAO/psicologo/usuario");
function setInserirPsicologo(user, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (String(contentType).toLowerCase() !== 'application/json') {
                return config_1.ERROR_CONTENT_TYPE;
            }
            if (!user) {
                return config_1.ERROR_NOT_CREATED;
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
            if (!user.nome || typeof user.nome !== 'string' || user.nome.length > 50 || user.nome.match("\\d") ||
                !user.cpf || user.cpf.length !== 11 || !(yield professional_data_validation_1.verificacaoProfissionais.verificarCpf(user.cpf)) ||
                !user.cip || user.cip.length !== 9 || !(yield professional_data_validation_1.verificacaoProfissionais.verificarCip(user.cip)) ||
                !user.data_nascimento || !validarData(user.data_nascimento.toString()) ||
                !user.email || typeof user.email !== 'string' || !(yield professional_data_validation_1.verificacaoProfissionais.verificarEmail(user.email)) || user.email.length > 256 ||
                !user.senha || typeof user.senha !== 'string' || user.senha.length < 8 || user.senha.length > 20 ||
                !user.telefone || user.telefone.length !== 11 || typeof user.telefone !== 'string' ||
                !user.id_sexo || isNaN(Number(user.id_sexo))) {
                if (!(yield professional_data_validation_1.verificacaoProfissionais.verificarEmail(user.email))) {
                    return config_1.ERROR_ALREADY_EXISTS_ACCOUNT_EMAIL;
                }
                if (!(yield professional_data_validation_1.verificacaoProfissionais.verificarCpf(user.cpf))) {
                    return config_1.ERROR_ALREADY_EXISTS_ACCOUNT_CPF;
                }
                if (!validarData(user.data_nascimento.toString())) {
                    return config_1.ERROR_INVALID_DATE;
                }
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
                    cip: user.cip,
                    data_nascimento: transformarData(user.data_nascimento.toString()),
                    id_sexo: user.id_sexo,
                };
                // Inserir novo cliente
                const newProfesional = yield (0, usuario_1.criarNovoPsicologo)(userData);
                if (newProfesional) {
                    return {
                        user: newProfesional,
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
            console.error('Erro ao tentar inserir um novo psicólogo:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
function getLogarPsicologo(email, senha) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email || typeof email != 'string' || email.length > 256 ||
            !senha || typeof senha != 'string' || senha.length < 8) {
            return config_1.ERROR_REQUIRED_FIELDS;
        }
        let clientData = yield (0, usuario_1.logarPsicologo)(email, senha);
        if (clientData) {
            return {
                data: clientData,
                status_code: 200
            };
        }
        else {
            return config_1.ERROR_NOT_FOUND;
        }
    });
}
function getBuscarPsicologo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id < 1) {
            return config_1.ERROR_REQUIRED_FIELDS;
        }
        else {
            let professionalData = yield (0, usuario_1.buscarPsicologo)(id);
            if (professionalData) {
                return {
                    data: professionalData,
                    status_code: 200
                };
            }
        }
    });
}
