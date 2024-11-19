import { ERROR_CONTENT_TYPE, ERROR_INTERNAL_SERVER, ERROR_NOT_CREATED, ERROR_NOT_FOUND_CLIENT, ERROR_NOT_FOUND_PROFESSIONAL, ERROR_REQUIRED_FIELDS } from "../../../module/config";
import { TAssessment } from "../../domain/entities/assessment";
import { isValidAssessment, isValidId } from "../../infra/zod-validations";
import { criarAvaliacao } from "../../model/DAO/avaliacao/avaliacao";
import { buscarCliente } from "../../model/DAO/cliente/usuario";
import { buscarPsicologo } from "../../model/DAO/psicologo/usuario";


export async function setCadastrarAvaliacao(avaliacao:TAssessment, contentType:string | undefined){
    try {
        if (String(contentType) !== "application/json") {
            return ERROR_CONTENT_TYPE
        }

        if 
        (
            !avaliacao.avaliacao || !isValidAssessment(avaliacao.avaliacao) ||
            !avaliacao.texto     ||
            !avaliacao.id_cliente || !isValidId(avaliacao.id_cliente) ||
            !avaliacao.id_psicologo || !isValidId(avaliacao.id_psicologo)
        ) 
        {
            return ERROR_REQUIRED_FIELDS
        }

        let validateProfessional = await buscarPsicologo(avaliacao.id_psicologo)

        if (!validateProfessional) {
            return ERROR_NOT_FOUND_PROFESSIONAL
        }

        let validateClient = await buscarCliente(avaliacao.id_cliente)

        if (!validateClient) {
            return ERROR_NOT_FOUND_CLIENT
        }
        
        let createAssessment = await criarAvaliacao(avaliacao)

        if (!createAssessment) {
            return{
                message: ERROR_NOT_CREATED.message,
                status_code: ERROR_NOT_CREATED.status_code
            }
        }else{
            return{
                data: createAssessment,
                status_code: 201
            }
        }
    } catch (error) {
        console.error('Erro ao tentar inserir uma nova avaliação:', error);
        return ERROR_INTERNAL_SERVER;
    }
}