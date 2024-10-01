import {ERROR_ALREADY_EXISTS_ACCOUNT_CPF, ERROR_ALREADY_EXISTS_ACCOUNT_EMAIL, ERROR_CONTENT_TYPE, ERROR_DATE_NOT_VALID, ERROR_INTERNAL_SERVER, ERROR_INTERNAL_SERVER_DB, ERROR_NOT_CREATED, ERROR_NOT_FOUND, ERROR_REQUIRED_FIELDS, SUCCESS_CREATED_ITEM } from "../../../module/config"
import { TUser } from "../../domain/entities/user-entity"
import { buscarCliente, criarNovoCliente, logarCliente } from "../../model/DAO/cliente/usuario"
import { getAllSexos, getSexoById } from "../../model/DAO/cliente/sexo";
import { verificacao } from "../../infra/client-data-validation";

export async function setInserirUsuario(user: TUser, contentType: string | undefined) {
    try {

        if (String(contentType).toLowerCase() !== 'application/json' || contentType === undefined) {
            return ERROR_CONTENT_TYPE;
        } 
        if (!user) {
            return ERROR_NOT_CREATED;
        }

        function validarData(data: string): boolean {
      
            if (data.length !== 10) return false;
        
            const partes = data.split("-");
            const ano = parseInt(partes[0], 10);
            const mes = parseInt(partes[1], 10);
            const dia = parseInt(partes[2], 10);
        
     
            if (mes < 1 || mes > 12) return false;
        
       
            const dataTestada = new Date(ano, mes - 1, dia);
            return dataTestada.getFullYear() === ano && dataTestada.getMonth() === mes - 1 && dataTestada.getDate() === dia;
        }
        
        function transformarData(data: string): Date {
            if (!validarData(data)) {
                throw new Error("Formato de data inválido");
            }
        
            return new Date(data);
        }
        
        if (
            !user.nome || typeof user.nome !== 'string' || user.nome.length > 50 || user.nome.match("\\d") ||
            !user.cpf || user.cpf.length !== 11 || !await verificacao.verificarCpf(user.cpf) ||
            !user.data_nascimento || !validarData(user.data_nascimento.toString()) || !transformarData(user.data_nascimento.toString()) ||
            !user.email || typeof user.email !== 'string' || !await verificacao.verificarEmail(user.email) || user.email.length > 256 ||
            !user.senha || typeof user.senha !== 'string' || user.senha.length < 8 || user.senha.length > 20 ||
            !user.telefone || user.telefone.length !== 11 || typeof user.telefone !== 'string' ||
            !user.id_sexo || isNaN(Number(user.id_sexo))
        ) {
            if(!await verificacao.verificarEmail(user.email)){
                return ERROR_ALREADY_EXISTS_ACCOUNT_EMAIL
            }
            if(!await verificacao.verificarCpf(user.cpf)){
                return ERROR_ALREADY_EXISTS_ACCOUNT_CPF
            }
            if(!validarData(user.data_nascimento.toString()) || !transformarData(user.data_nascimento.toString())){
                return ERROR_DATE_NOT_VALID
            }
            if(!validarData(user.data_nascimento.toString())){
                return ERROR_DATE_NOT_VALID

            }

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

export async function getListarSexo() {
    let genderData = await getAllSexos()

    if (genderData) {
        return {
            data: genderData,
            status_code: 200,
            quantidade: genderData.length
        }
    }
    else {
        return ERROR_NOT_FOUND
    }
}

export async function getBuscarSexo(id: number) {
    let sexId = id

    let sexData = await getSexoById(sexId)

    if (sexData) {
        return {
            data: sexData,
            status_code: 200
        }
    }
    else {
        return ERROR_NOT_FOUND
    }
}

export async function getLogarCliente(email: string | undefined, senha: string | undefined) {
    if(
        !email || typeof email != 'string' ||
        !senha || typeof senha != 'string'
    ){
        return ERROR_REQUIRED_FIELDS 
    }

    let clientData = await logarCliente(email, senha)

    if(clientData){
        return {
            data: clientData,
            status_code: 200
        }
    }
    else{
        return ERROR_NOT_FOUND
    }
}

export async function getBuscarCliente(id:number) {
    if
    (
        !id || typeof id !== 'number' || id < 1
    ){
        return ERROR_REQUIRED_FIELDS
    }
    else{
        let clientData = await buscarCliente(id)

        if(clientData){
            return{
                data: clientData,
                status_code: 200
            }
        }
        return{
            data: ERROR_NOT_FOUND.message,
            status_code: 404
        }
    }
}