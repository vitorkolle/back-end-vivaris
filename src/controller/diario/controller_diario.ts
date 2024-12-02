import { ERROR_CONTENT_TYPE, ERROR_INVALID_ID, ERROR_NOT_DELETED, ERROR_NOT_FOUND_CLIENT, ERROR_NOT_FOUND_EMOTION, ERROR_NOT_UPDATED, ERROR_REQUIRED_FIELDS, SUCCESS_DELETED_ITEM } from "../../../module/config";
import { TDiary } from "../../domain/entities/diary-entity";
import { isValidId } from "../../infra/zod-validations";
import { buscarCliente } from "../../model/DAO/cliente/usuario";
import { deleteDiario, updateDiario } from "../../model/DAO/diario/diario";
import { getBuscarEmocao } from "../emocoes/controller_emocoes";
import { getBuscarPreferencia } from "../preferencia/controller_preferencia";

export async function setAtualizarDiario(diarioInput : TDiary, id : number, contentType : string | undefined){
    try {
        if (String(contentType).toLowerCase() !== "application/json") {
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

        if(
            !diarioInput.anotacoes || diarioInput.anotacoes.length > 2500 ||
            !diarioInput.data_diario || !transformarData(diarioInput.data_diario.toString()) ||
            !diarioInput.id_humor || !isValidId(diarioInput.id_humor) ||
            !diarioInput.id_cliente || !isValidId(diarioInput.id_cliente) || !isValidId(id)
        ) {
            return ERROR_REQUIRED_FIELDS
        }

        let validateMood = await getBuscarEmocao(diarioInput.id_humor)

        if (!validateMood) {
            return ERROR_NOT_FOUND_EMOTION
        }

        let validateClient = await buscarCliente(diarioInput.id_cliente)

        if (!validateClient) {
            return ERROR_NOT_FOUND_CLIENT
        }

        const inputDiary : TDiary = {
            anotacoes: diarioInput.anotacoes,
            data_diario: transformarData(diarioInput.data_diario.toString()),
            id_cliente: diarioInput.id_cliente,
            id_humor: diarioInput.id_humor
        }

        let updateDiary = await updateDiario(inputDiary, id)

        if (!updateDiary) {
            return ERROR_NOT_UPDATED
        }

        return{
            status_code: 200,
            data: updateDiary
        }

    } catch (error) {
        console.error("Erro ao atualizar diario:", error);
        throw new Error("Erro ao atualizar diario");
    }
}

export async function setDeletarDiario(id : number) {
    try {
        if (!id || !isValidId(id)) {
            return ERROR_INVALID_ID
        }

        let deleteDiary = await deleteDiario(id)

        if (!deleteDiary) {
            return ERROR_NOT_DELETED
        }

        return{
            status_code: 200,
            message: SUCCESS_DELETED_ITEM.message
        }
    } catch (error) {
        console.error("Erro ao deletar diario:", error);
        throw new Error("Erro ao deletar diario");
    }
}