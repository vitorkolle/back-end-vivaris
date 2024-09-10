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
exports.setInserirPreferencias = setInserirPreferencias;
const config_1 = require("../../../module/config");
const client_preferences_validation_1 = require("../../infra/client-preferences-validation");
const usuario_1 = require("../../model/DAO/cliente/usuario");
function setInserirPreferencias(userData, contentType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (String(contentType).toLowerCase() !== 'application/json' || contentType === undefined) {
                return config_1.ERROR_CONTENT_TYPE;
            }
            if (!userData) {
                return config_1.ERROR_NOT_CREATED;
            }
            else {
                if (!userData.id_cliente || typeof userData.id_cliente != 'number' ||
                    !userData.preferencias || userData.preferencias == null) {
                    return config_1.ERROR_REQUIRED_FIELDS;
                }
                else {
                    let newUserPreference;
                    for (let index = 0; index < userData.preferencias.length; index++) {
                        const preferencia = userData.preferencias[index];
                        const verificarPreferencia = !(yield client_preferences_validation_1.verificarPreferencias.isValid(preferencia));
                        const preferenciaExistente = yield client_preferences_validation_1.verificarPreferencias.alreadyExists(preferencia);
                        if (verificarPreferencia) {
                            if (preferenciaExistente) {
                                newUserPreference = yield (0, usuario_1.criarPreferenciasUsuario)(userData.id_cliente, preferencia);
                            }
                            else {
                                return config_1.ERROR_ALREADY_EXISTS_PREFRENCE;
                            }
                        }
                        else {
                            return config_1.ERROR_NOT_FOUND_PREFERENCE;
                        }
                    }
                    if (newUserPreference) {
                        return {
                            data: newUserPreference,
                            status_code: 200,
                            message: config_1.SUCCESS_CREATED_ITEM.message
                        };
                    }
                    else {
                        return config_1.ERROR_INTERNAL_SERVER_DB;
                    }
                }
            }
        }
        catch (error) {
            console.error('Erro ao tentar inserir um novo usuário:', error);
            return config_1.ERROR_INTERNAL_SERVER;
        }
    });
}
