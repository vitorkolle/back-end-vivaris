import { ERROR_CONTENT_TYPE, ERROR_INTERNAL_SERVER, ERROR_INTERNAL_SERVER_DB, ERROR_NOT_CREATED, ERROR_REQUIRED_FIELDS, SUCCESS_CREATED_ITEM } from "../../module/config"
import { TUser } from "../domain/entities/user-entity"
import { criarNovoCliente } from "../model/DAO/cliente/usuario"

export async function setInserirUsuario(user: TUser, contentType: String | undefined) {
    try {
        if (String(contentType).toLowerCase() != 'application/json' || contentType == undefined) {
            return ERROR_CONTENT_TYPE
        } else {
            if (user) {
                 if (
                     user.nome == '' || user.nome == undefined || user.nome == null       ||
                    user.cpf == undefined || user.cpf == null || user.cpf == '' || user.cpf.length != 11 ||
                     user.data_nascimento == undefined || user.data_nascimento == null || user.data_nascimento || 
                     user.email == '' || user.email == undefined || user.email == null ||
                     user.senha == '' || user.senha == undefined || user.senha == null ||
                     user.telefone == undefined || user.telefone == null || user.telefone == ''|| user.telefone.length != 11 ||
                     user.id_sexo == undefined || user.id_sexo == null || isNaN(user.id_sexo)

                 ) {
                     return ERROR_REQUIRED_FIELDS
                 }
                 else {
                    let userData: TUser
                    userData = {
                        nome: user.nome,
                        email: user.email,
                        senha: user.senha,
                        telefone: user.telefone,
                        cpf: user.cpf,
                        data_nascimento: user.data_nascimento,
                        id_sexo: user.id_sexo
                    }

                    let newClient = await criarNovoCliente(userData)

                    if (newClient) {
                        const responseJson = {
                            user: userData,
                            status_code: SUCCESS_CREATED_ITEM.status_code,
                            message: SUCCESS_CREATED_ITEM.message
                        }

                        return responseJson
                    } else {
                        return ERROR_INTERNAL_SERVER_DB
                    }
                 }
            }else{
                return ERROR_NOT_CREATED
            }
        }
    }
    catch (error) {
        console.error('Error ao tentar inserir um novo usuário:', error)
        throw new Error('Erro required fields')
        return ERROR_INTERNAL_SERVER
    }
}