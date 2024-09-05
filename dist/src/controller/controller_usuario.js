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
function validarData(data) {
    // Verificar se a data é válida
    return isNaN(data.getTime());
}
function setInserirUsuario(user, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (String(contentType).toLowerCase() != 'application/json' || contentType == undefined) {
                return config_1.ERROR_CONTENT_TYPE;
            }
            else {
                if (user) {
                    // if (
                    //     user.nome == '' || user.nome == undefined || user.nome == null       ||
                    //     user.cpf == undefined || user.cpf == null || user.cpf == '' || user.cpf.length != 11 ||
                    //     user.data_nascimento == undefined || user.data_nascimento == null || validarData(user.data_nascimento) == false || 
                    //     user.email == '' || user.email == undefined || user.email == null ||
                    //     user.senha == '' || user.senha == undefined || user.senha == null ||
                    //     user.telefone == undefined || user.telefone == null || user.telefone == ''|| user.telefone.length != 11 ||
                    //     user.id_sexo == undefined || user.id_sexo == null || isNaN(user.id_sexo)
                    // ) {
                    //     return ERROR_REQUIRED_FIELDS
                    // }
                    // else {
                    let userData;
                    userData = {
                        nome: user.nome,
                        email: user.email,
                        senha: user.senha,
                        telefone: user.telefone,
                        cpf: user.cpf,
                        data_nascimento: user.data_nascimento,
                        id_sexo: user.id_sexo
                    };
                    let newClient = yield (0, usuario_1.criarNovoCliente)(userData);
                    if (newClient) {
                        const responseJson = {
                            user: userData,
                            status_code: config_1.SUCCESS_CREATED_ITEM.status_code,
                            message: config_1.SUCCESS_CREATED_ITEM.message
                        };
                        return responseJson;
                    }
                    else {
                        return config_1.ERROR_INTERNAL_SERVER_DB;
                    }
                    // }
                }
                else {
                    return config_1.ERROR_NOT_CREATED;
                }
            }
        }
        catch (error) {
            console.error('Error ao tentar inserir um novo usuário:', error);
            throw new Error('Erro required fields');
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
