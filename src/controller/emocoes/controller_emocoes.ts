import { ERROR_ALREADY_EXISTS_EMOTION, ERROR_ALREADY_EXISTS_PREFRENCE, ERROR_CONTENT_TYPE, ERROR_INVALID_ID, ERROR_NOT_CREATED, ERROR_NOT_FOUND, ERROR_NOT_FOUND_CLIENT, ERROR_REQUIRED_FIELDS } from "../../../module/config";
import { TEmotion } from "../../domain/entities/emotion-entity";
import { isValidId, isValidMood } from "../../infra/zod-validations";
import { buscarCliente } from "../../model/DAO/cliente/usuario";
import { buscarEmocao, createEmocao, validarEmocao } from "../../model/DAO/emocoes/emocoes";

export async function setCriarEmocao(emocao: TEmotion, contentType : string | undefined) {
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
            !emocao.id_cliente || !isValidId(emocao.id_cliente) ||
            !emocao.data || !transformarData(String(emocao.data)) ||
            !emocao.emocao || !isValidMood(emocao.emocao)
        ) {
            return ERROR_REQUIRED_FIELDS
        }

        let validateClient = await buscarCliente(emocao.id_cliente)

        if (!validateClient) {
            return ERROR_NOT_FOUND_CLIENT
        }
        
        const inputEmocao = {
            emocao: emocao.emocao,
            data: transformarData(String(emocao.data)),
            id_cliente: emocao.id_cliente
        }

        let validateEmotion = await validarEmocao(inputEmocao)

        if (validateEmotion) {
            return ERROR_ALREADY_EXISTS_EMOTION
        }

        let emotion = await createEmocao(inputEmocao)

        if (!emotion) {
            return ERROR_NOT_CREATED
        }

        return{
            status_code: 201,
            data: emotion
        }
    } catch (error) {
        console.error("Erro ao criar nova emocao:", error);
        throw new Error("Não foi possível criar a emocao");
    }
}

export async function getBuscarEmocao(id:number) {
    if (!id || !isValidId(id)) {
        return ERROR_INVALID_ID
    }

    let emotion = await buscarEmocao(id)

    if (!emotion) {
        return ERROR_NOT_FOUND
    }

    return{
        status_code: 200,
        data: emotion
    }
}