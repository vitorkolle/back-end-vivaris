import { ERROR_CONTENT_TYPE, ERROR_INTERNAL_SERVER, ERROR_INTERNAL_SERVER_DB, ERROR_NOT_CREATED, ERROR_NOT_FOUND, ERROR_REQUIRED_FIELDS, SUCCESS_CREATED_ITEM } from "../../../module/config"
import { TProfessional } from "../../domain/entities/professional-entity";
import { verificacaoProfissionais } from "../../infra/professional-data-validation";
import { criarNovoPsicologo, logarPsicologo } from "../../model/DAO/psicologo/usuario";

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
            if (!validarData(data)) {
                throw new Error("Formato de data inválido");
            }
        
            return new Date(data);
        }

        if (
            !user.nome || typeof user.nome !== 'string' || user.nome.length > 50 || user.nome.match("\\d") ||
            !user.cpf || user.cpf.length !== 11 || !await verificacaoProfissionais.verificarCpf(user.cpf) ||
            !user.cip || user.cip.length !== 9 || !await verificacaoProfissionais.verificarCip(user.cip) ||
            !user.data_nascimento || !validarData(user.data_nascimento.toString()) ||
            !user.email || typeof user.email !== 'string' || !await verificacaoProfissionais.verificarEmail(user.email) || user.email.length > 256 ||
            !user.senha || typeof user.senha !== 'string' || user.senha.length < 8 || user.senha.length > 20 ||
            !user.telefone || user.telefone.length !== 11 || typeof user.telefone !== 'string' ||
            !user.id_sexo || isNaN(Number(user.id_sexo)) 
        ){
            return ERROR_REQUIRED_FIELDS
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
        !email || typeof email != 'string' || email.length > 256 ||
        !senha || typeof senha != 'string' || senha.length < 8
    ){
        return ERROR_REQUIRED_FIELDS
    }

    let clientData = await logarPsicologo(email, senha)

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

