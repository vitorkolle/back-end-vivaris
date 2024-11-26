import { createJWT } from "../../../middleware/middlewareJWT";
import { ERROR_AGE_NOT_VALID, ERROR_ALREADY_EXISTS_ACCOUNT_CIP, ERROR_ALREADY_EXISTS_ACCOUNT_CPF, ERROR_ALREADY_EXISTS_ACCOUNT_EMAIL, ERROR_CONTENT_TYPE, ERROR_DATE_NOT_VALID, ERROR_INTERNAL_SERVER, ERROR_INTERNAL_SERVER_DB, ERROR_NOT_CREATED, ERROR_NOT_FOUND, ERROR_REQUIRED_FIELDS, SUCCESS_CREATED_ITEM } from "../../../module/config";
import { TProfessional } from "../../domain/entities/professional-entity";
import { verificacaoProfissionais } from "../../infra/professional-data-validation";
import { isValidEmail, isValidId, isValidName, isValidPassword } from "../../infra/zod-validations";
import { buscarPsicologo, criarNovoPsicologo, listarPsicologos, logarPsicologo } from "../../model/DAO/psicologo/usuario";

export async function setInserirPsicologo(user: TProfessional, contentType: string | undefined) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return ERROR_CONTENT_TYPE
        }

        if (!user) {
            return ERROR_NOT_CREATED
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
            const dataFinal = new Date(data)

            if (dataFinal) {
                return dataFinal;
            } else {
                throw new Error("Invalid date format");
            } 
        }

        function validarIdade(userDate: Date) : number{

            const birthDate = new Date(userDate)
            
            const birthYear = birthDate.getFullYear()
            const birthMonth = birthDate.getMonth()
            const birthDay = birthDate.getDate()

            const date = new Date()
            const actualYear = date.getFullYear()
            const actualMonth = date.getMonth()
            const actualDay = date.getDate()

            let age = actualYear - birthYear

            if(actualMonth < birthMonth || actualMonth == birthMonth && actualDay == birthDay){
                age--
            }

            return age < 0 ? 0 : age  
        }

        // Validação dos campos obrigatórios
        if (
            !user.nome || !isValidName(user.nome)  ||
            !user.cpf || user.cpf.length !== 11 || !await verificacaoProfissionais.verificarCpf(user.cpf) ||
            !user.cip || user.cip.length !== 9 || !await verificacaoProfissionais.verificarCip(user.cip) ||
            !user.data_nascimento || !validarData(user.data_nascimento.toString()) || validarIdade(user.data_nascimento) < 18 || 
            !user.email || !isValidEmail(user.email)  ||
            !user.senha || !isValidPassword(user.senha)  ||
            !user.telefone || user.telefone.length !== 11 || typeof user.telefone !== 'string' ||
            !user.id_sexo || !isValidId(user.id_sexo) 
        ){
            if(!await verificacaoProfissionais.verificarEmail(user.email)){
                return ERROR_ALREADY_EXISTS_ACCOUNT_EMAIL
            }
            if(!await verificacaoProfissionais.verificarCpf(user.cpf)){
                return ERROR_ALREADY_EXISTS_ACCOUNT_CPF
            }
            if(!await verificacaoProfissionais.verificarCip(user.cip)){
                return ERROR_ALREADY_EXISTS_ACCOUNT_CIP
            }
            if(!validarData(user.data_nascimento.toString())){
                return ERROR_DATE_NOT_VALID
            }
            if (validarIdade(user.data_nascimento) < 18) {
                return ERROR_AGE_NOT_VALID
            }

            return ERROR_REQUIRED_FIELDS;
        }
        else{
            // Preparar os dados do usuário
            const userData: TProfessional = {
                nome: user.nome,
                email: user.email,
                senha: user.senha,
                telefone: user.telefone,
                cpf: user.cpf,
                cip: user.cip,
                data_nascimento: transformarData(user.data_nascimento.toString()),
                id_sexo: user.id_sexo,
                preco: user.preco
            };

            // Inserir novo cliente
            const newProfesional = await criarNovoPsicologo(userData);

            if (newProfesional) {
                return {
                    user: newProfesional,
                    status_code: SUCCESS_CREATED_ITEM.status_code,
                    message: SUCCESS_CREATED_ITEM.message,
                };
            } else {
                return ERROR_INTERNAL_SERVER_DB;
            }
        }

    } catch (error) {
        console.error('Erro ao tentar inserir um novo psicólogo:', error);
        return ERROR_INTERNAL_SERVER;
    }
}

export async function getLogarPsicologo(email: string | null, senha: string | null) {
    if(
        !email || !isValidEmail(email)  ||
        !senha || !isValidPassword(senha) 
    ){
        return ERROR_REQUIRED_FIELDS
    }

    let clientData = await logarPsicologo(email, senha)

    if(clientData.id > 0){
        let professionalToken = await createJWT({id:clientData.id, role:'professional'})
        return {
            data: clientData,
            token: professionalToken,
            status_code: 200
        }
    }
    else{
        return ERROR_NOT_FOUND
    }
}

export async function getBuscarPsicologo(id: number) {
    if (
        !isValidId(id)
    ) {
        return ERROR_REQUIRED_FIELDS
    }
    else{
        let professionalData = await buscarPsicologo(id)

        if(professionalData.status_code === 200){
            return {
                data: professionalData,
                status_code: 200,
                status: true
            }
        }
        else{
            return{
                data: ERROR_NOT_FOUND.message,
                status_code: ERROR_NOT_FOUND.status_code,
                status: ERROR_NOT_FOUND.status
            }
        }
    }
}

export async function getListarPsicologos() {
    let professionalData = await listarPsicologos()

    if(professionalData.status_code === 200){
        return {
            data: professionalData,
            status_code: 200,
            status: true
        }
    }
    else{
        return{
            data: ERROR_NOT_FOUND.message,
            status_code: ERROR_NOT_FOUND.status_code,
            status: ERROR_NOT_FOUND.status
        }
    }
}

