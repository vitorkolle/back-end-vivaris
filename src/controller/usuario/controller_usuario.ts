import {ERROR_ALREADY_EXISTS_ACCOUNT_CPF, ERROR_ALREADY_EXISTS_ACCOUNT_EMAIL, ERROR_CONTENT_TYPE, ERROR_DATE_NOT_VALID, ERROR_INTERNAL_SERVER, ERROR_INTERNAL_SERVER_DB, ERROR_NOT_CREATED, ERROR_NOT_FOUND, ERROR_NOT_FOUND_CLIENT, ERROR_NOT_UPDATED, ERROR_REQUIRED_FIELDS, SUCCESS_CREATED_ITEM } from "../../../module/config"
import { TUser } from "../../domain/entities/user-entity"
import { buscarCliente, criarNovoCliente, listarUsuarios, logarCliente, obterUsuarioComPreferencias, updateUsuario, validateCLiente } from "../../model/DAO/cliente/usuario"
import { getAllSexos, getSexoById } from "../../model/DAO/cliente/sexo";
import { verificacao } from "../../infra/client-data-validation";
import {createJWT} from '../../../middleware/middlewareJWT'
import { isValidEmail, isValidId, isValidName, isValidPassword } from "../../infra/zod-validations";

export async function setInserirUsuario(user: TUser, contentType: string | undefined) {
    try {

        if (String(contentType).toLowerCase() !== 'application/json' || contentType === undefined) {
            return ERROR_CONTENT_TYPE;
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
            !user.nome || !isValidName(user.nome) ||
            !user.cpf || user.cpf.length !== 11 || !await verificacao.verificarCpf(user.cpf) ||
            !user.data_nascimento || !validarData(user.data_nascimento.toString()) || !transformarData(user.data_nascimento.toString()) ||
            !user.email || !isValidEmail(user.email) || !await verificacao.verificarEmail(user.email) ||
            !user.senha || !isValidPassword(user.senha) ||
            !user.telefone || user.telefone.length !== 11 || typeof user.telefone !== 'string' || 
            !user.id_sexo || !isValidId(user.id_sexo)
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

    if(
        !isValidId(id)
    ){
        return ERROR_REQUIRED_FIELDS
    }

    let sexData = await getSexoById(id)

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
    try {
        if(
            !email || !isValidEmail(email) ||
            !senha || !isValidPassword(senha)
        ){
            return ERROR_REQUIRED_FIELDS 
        }
    
        let clientData = await logarCliente(email, senha)
    
        
    
        if(clientData.status == 200){
            let clientToken = await createJWT({id:clientData.id, role:'client'})
            return {
                cliente: clientData,
                token: clientToken,
                status_code: clientData.status
            }
        }
        else{
            return ERROR_NOT_FOUND
        }   
    } catch (error) {
        console.error('Erro ao tentar logar usuário:', error);
        return ERROR_INTERNAL_SERVER;
    }
}

export async function getBuscarCliente(id:number) {
    if
    (
        !isValidId(id)
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

export async function getBuscarClientePreferencias(id:number) {
    if(
        !isValidId(id)
    ){
        return ERROR_REQUIRED_FIELDS
    }

    let clientData = await obterUsuarioComPreferencias(id)

    if(!clientData){
        return{
            data: ERROR_NOT_FOUND.message,
            status_code: 404
        }
    }

    return{
        data: clientData,
        status_code: 200
    }
}

export async function getListarClientes() {
    let clientData = await listarUsuarios()

    if(!clientData){
        return {
            data: ERROR_NOT_FOUND.message,
            status_code: 404
        }
    }

    return {
        data: clientData,
        status_code: 200
    }
}

export async function setAtualizarCliente(id : number, data: TUser, contentType : string | undefined) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return ERROR_CONTENT_TYPE
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
            !id || !isValidId(id) ||
            !data.nome || !isValidName(data.nome) ||
            !data.data_nascimento || !validarData(data.data_nascimento.toString()) || !transformarData(data.data_nascimento.toString()) ||
            !data.id_sexo || !isValidId(data.id_sexo)
        ) {
            return ERROR_REQUIRED_FIELDS
        }

        if (data.foto_perfil) {
            if (data.foto_perfil?.length > 300) {
                return ERROR_REQUIRED_FIELDS
            }

            const inputData : TUser = {
                foto_perfil: data.foto_perfil,
                nome: data.nome,
                data_nascimento: transformarData(data.data_nascimento.toString()),
                id_sexo: data.id_sexo,
                cpf: data.cpf,
                email: data.email,
                telefone: data.telefone,
                senha: data.senha
            }

            let validateClient = await validateCLiente(inputData)

            if (!validateClient) {
                ERROR_NOT_FOUND_CLIENT
            }

            let updateClient = await updateUsuario(id, inputData)

            if (updateClient) {
                return {
                    data: updateClient,
                    status_code: 200
                }
            }
            else {
                return ERROR_NOT_UPDATED
            }
        }

        const inputData : TUser = {
            foto_perfil: null,
            nome: data.nome,
            data_nascimento: transformarData(data.data_nascimento.toString()),
            id_sexo: data.id_sexo,
            cpf: data.cpf,
            email: data.email,
            telefone: data.telefone,
            senha: data.senha
        }

        let validateClient = await validateCLiente(inputData)

            if (!validateClient) {
                ERROR_NOT_FOUND_CLIENT
            }

            let updateClient = await updateUsuario(id, inputData)

            if (updateClient) {
                return {
                    data: updateClient,
                    status_code: 200
                }
            }
            else {
                return ERROR_NOT_UPDATED
            }

    } catch (error) {
        console.error('Erro ao tentar atualizar os dados do usuário:', error);
        return ERROR_INTERNAL_SERVER
    }
}