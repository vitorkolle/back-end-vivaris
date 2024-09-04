import { ERROR_CONTENT_TYPE, ERROR_INTERNAL_SERVER, ERROR_INTERNAL_SERVER_DB, ERROR_REQUIRED_FIELDS, SUCCESS_CREATED_ITEM } from "../../module/config"
import { TUser } from "../domain/entities/user-entity"
import { criarNovoCliente } from "../model/DAO/usuario"

export async function setInserirUsuario(user: TUser, contentType: String | undefined) {
    try {
        if (String(contentType).toLowerCase() != 'application/json' || contentType == undefined) {
            return ERROR_CONTENT_TYPE
        } else {
            if(user){
                const userData:TUser = {
                    nome: user.nome,
                    email: user.email,
                    senha: user.senha,
                    telefone: user.telefone,
                    cpf: user.cpf,
                    data_nascimento: user.data_nascimento,
                    sexo: user.sexo
                }
                
                let newClient = await criarNovoCliente(userData)

                if(newClient){

                    const responseJson = {
                        user: userData,
                        status_code: SUCCESS_CREATED_ITEM.status_code,
                        message: SUCCESS_CREATED_ITEM.message
                    }

                    return responseJson
                }else{
                    return ERROR_INTERNAL_SERVER_DB
                }

            }else{
                return ERROR_REQUIRED_FIELDS
            }
        }
    } catch (error) {
        return ERROR_INTERNAL_SERVER
    }
}