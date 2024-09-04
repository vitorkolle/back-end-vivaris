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
const usuario_1 = require("../model/DAO/usuario");
function setInserirUsuario(user, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (String(contentType).toLowerCase() != 'application/json' || contentType == undefined) {
                return config_1.ERROR_CONTENT_TYPE;
            }
            else {
                if (user) {
                    const userData = {
                        nome: user.nome,
                        email: user.email,
                        senha: user.senha,
                        telefone: user.telefone,
                        cpf: user.cpf,
                        data_nascimento: user.data_nascimento,
                        sexo: user.sexo
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
                }
                else {
                    return config_1.ERROR_REQUIRED_FIELDS;
                }
            }
        }
        catch (error) {
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
