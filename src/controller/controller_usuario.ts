import { ERROR_CONTENT_TYPE, ERROR_INTERNAL_SERVER, ERROR_INTERNAL_SERVER_DB, ERROR_NOT_CREATED, ERROR_REQUIRED_FIELDS, SUCCESS_CREATED_ITEM } from "../../module/config"
import { TUser } from "../domain/entities/user-entity"
import { criarNovoCliente } from "../model/DAO/cliente/usuario"


function validarData(data: Date): boolean {
    
    if (isNaN(data.getTime())) return false; 
    const hoje = new Date();
    return data <= hoje; 
}

export async function setInserirUsuario(user: TUser, contentType: string | undefined) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json' || contentType === undefined) {
            return ERROR_CONTENT_TYPE;
        }

        if (!user) {
            return ERROR_NOT_CREATED;
        }

        // Validação dos campos obrigatórios
        if (
            !user.nome || typeof user.nome !== 'string' ||
            !user.cpf || user.cpf.length !== 11 ||
            !user.data_nascimento || !(user.data_nascimento instanceof Date) || !validarData(user.data_nascimento) ||
            !user.email || typeof user.email !== 'string' ||
            !user.senha || typeof user.senha !== 'string' ||
            !user.telefone || user.telefone.length !== 11 ||
            !user.id_sexo || isNaN(Number(user.id_sexo))
        ) {
            return ERROR_REQUIRED_FIELDS;
        }
      else {
        // Preparar os dados do usuário
        const userData: TUser = {
            nome: user.nome,
            email: user.email,
            senha: user.senha,
            telefone: user.telefone,
            cpf: user.cpf,
            data_nascimento: user.data_nascimento,
            id_sexo: user.id_sexo,
        };

        // Inserir novo cliente
        const newClient = await criarNovoCliente(userData);

        if (newClient) {

            return {
                user: newClient,
                status_code: SUCCESS_CREATED_ITEM.status_code,
                message: SUCCESS_CREATED_ITEM.message,
            };
        } else {
            return ERROR_INTERNAL_SERVER_DB;
        }
    } catch (error) {
        console.error('Erro ao tentar inserir um novo usuário:', error);
        return ERROR_INTERNAL_SERVER;
    }
}
