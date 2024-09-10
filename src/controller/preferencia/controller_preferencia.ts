import { UserPreferences } from "typescript";
import { ERROR_ALREADY_EXISTS_PREFRENCE, ERROR_CONTENT_TYPE, ERROR_INTERNAL_SERVER, ERROR_INTERNAL_SERVER_DB, ERROR_NOT_CREATED, ERROR_NOT_FOUND_PREFERENCE, ERROR_REQUIRED_FIELDS, SUCCESS_CREATED_ITEM } from "../../../module/config";
import { TUserPreferences } from "../../domain/entities/user-preferences";
import { verificarPreferencias } from "../../infra/client-preferences-validation";
import { criarPreferenciasUsuario } from "../../model/DAO/cliente/usuario";

export async function setInserirPreferencias(userData : TUserPreferences, contentType: string | undefined) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json' || contentType === undefined) {
            return ERROR_CONTENT_TYPE;
        }

        if(!userData){
            return ERROR_NOT_CREATED
        }
        else{
            if(
                !userData.id_cliente|| typeof userData.id_cliente != 'number' ||
                !userData.preferencias || userData.preferencias == null

            ){
                return ERROR_REQUIRED_FIELDS
            }
            else{
                let newUserPreference
                for (let index = 0; index < userData.preferencias.length; index++) {
                    const preferencia = userData.preferencias[index];

                    const verificarPreferencia = !await verificarPreferencias.isValid(preferencia)
                    const preferenciaExistente =  await verificarPreferencias.alreadyExists(preferencia)

                    if(verificarPreferencia){
                        if(preferenciaExistente){
                            newUserPreference = await criarPreferenciasUsuario(userData.id_cliente, preferencia)
                        }
                        else{
                            return ERROR_ALREADY_EXISTS_PREFRENCE
                        }
                    }
                    else{
                        return ERROR_NOT_FOUND_PREFERENCE
                    }
                }

                if(newUserPreference){
                    return{
                        data: newUserPreference,
                        status_code: 200,
                        message: SUCCESS_CREATED_ITEM.message
                       }
                }else{
                    return ERROR_INTERNAL_SERVER_DB
                }
               
            }
        }
    } catch (error) {
        console.error('Erro ao tentar inserir um novo usuário:', error);
        return ERROR_INTERNAL_SERVER;
    }
}