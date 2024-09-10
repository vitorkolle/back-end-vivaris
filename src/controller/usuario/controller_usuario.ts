import { ERROR_CONTENT_TYPE, ERROR_INTERNAL_SERVER, ERROR_INTERNAL_SERVER_DB, ERROR_NOT_CREATED, ERROR_NOT_FOUND, ERROR_REQUIRED_FIELDS, SUCCESS_CREATED_ITEM } from "../../../module/config"
import { TUser } from "../../domain/entities/user-entity"
import { criarNovoCliente } from "../../model/DAO/cliente/usuario"
import { getAllSexos } from "../../model/DAO/cliente/sexo";
import { verificacao } from "../../infra/client-data-validation";

export async function setInserirUsuario(user: TUser, contentType: string | undefined) {
    try {
        
        if (String(contentType).toLowerCase() !== 'application/json' || contentType === undefined) {
            return ERROR_CONTENT_TYPE;
        }
        if (!user) {
            return ERROR_NOT_CREATED;
        }

        function validarData(data: string): boolean  {
            
            if(data.length != 10) return false

            return true
                   
        }

        function transformarData(data: string ) : Date{            
            const dataFinal = new Date(data)
            
            if (dataFinal) {
                return dataFinal;
            } else {
                throw new Error("Invalid date format");
            }
            
          
        }
        
        
        // Validação dos campos obrigatórios
        if (
            !user.nome || typeof user.nome !== 'string' ||
            !user.cpf || user.cpf.length !== 11 ||  !await verificacao.verificarCpf(user.cpf) ||
            !user.data_nascimento || !validarData(user.data_nascimento.toString()) ||
            !user.email || typeof user.email !== 'string' ||  !await verificacao.verificarEmail(user.email) ||
            !user.senha || typeof user.senha !== 'string' ||
            !user.telefone || user.telefone.length !== 11 || typeof user.telefone !== 'string' ||
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
                data_nascimento: transformarData(user.data_nascimento.toString()),
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
        }
    }
    catch (error) {
        console.error('Erro ao tentar inserir um novo usuário:', error);
        return ERROR_INTERNAL_SERVER;
    }
}

export async function getListarSexo(){
    let genderData = await getAllSexos()

    if(genderData){
        return{
            data: genderData,
            status_code: 200,
            quantidade: genderData.length
        }
    }
    else{
        return ERROR_NOT_FOUND
    }
}