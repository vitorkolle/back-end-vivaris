import { ERROR_ALREADY_EXISTS_PREFRENCE, ERROR_ALREADY_EXISTS_PROFESSIONAL_AVAILBILITY, ERROR_CONTENT_TYPE, ERROR_DATE_NOT_VALID, ERROR_INTERNAL_SERVER, ERROR_INTERNAL_SERVER_DB, ERROR_INVALID_ID, ERROR_NOT_CREATED, ERROR_NOT_DELETED, ERROR_NOT_FOUND, ERROR_NOT_FOUND_AVAILBILITY, ERROR_NOT_FOUND_PROFESSIONAL, ERROR_REQUIRED_FIELDS, SUCCESS_CREATED_ITEM, SUCCESS_DELETED_ITEM } from "../../../module/config";
import { TAvailability, WeekDay } from "../../domain/entities/availability-entity";
import { TProfessionalAvailability } from "../../domain/entities/professional-availability";
import { isValidWeekDay, isValidId, isValidHour, isValidAvailbilityStatus } from "../../infra/zod-validations";
import { atualizarDisponibilidade, atualizarDisponibilidadeProfissional, buscarDisponibilidade, buscarDisponibilidadeByHourAndWeekDay, buscarDisponibilidadePsicologo, criarDisponibilidade, criarDisponibilidadeProfissional, deletarDisponibilidade, deletarDisponibilidadeByHour, listarDisponibilidadesPorProfissional } from "../../model/DAO/disponibilidade/disponibilidade";
import { buscarPsicologo } from "../../model/DAO/psicologo/usuario";
import { getBuscarPsicologo } from "../usuario/controller_psicologo";


export function transformarHorario(horario: string): Date {
    const hoje = new Date();
    const [horas, minutos, segundos] = horario.split(':').map(Number);
    hoje.setUTCHours(horas, minutos, segundos, 0); // Define o horário no UTC
    return hoje;
}

export async function setInserirDisponibilidade(disponibilidade: TAvailability, contentType: string | undefined) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return ERROR_CONTENT_TYPE
        }
        if (!disponibilidade) {
            return ERROR_NOT_CREATED
        }
        
        // * Os horários precisam ser enviados no formato HH:MM:SS
        if (!disponibilidade.dia_semana || !isValidWeekDay(disponibilidade.dia_semana) ||
            !disponibilidade.horario_inicio || !isValidHour(disponibilidade.horario_inicio.toString()) ||
            !disponibilidade.horario_fim || !isValidHour(disponibilidade.horario_fim.toString())
        ) {
            return ERROR_REQUIRED_FIELDS
        } else {

            const disponibilidadeInput: TAvailability = { 
                dia_semana: disponibilidade.dia_semana,
                horario_inicio: transformarHorario(disponibilidade.horario_inicio.toString()),
                horario_fim: transformarHorario(disponibilidade.horario_fim.toString())
            }

            const newAvailability = await criarDisponibilidade(disponibilidadeInput)
            if (newAvailability) {
                return {
                    data: newAvailability,
                    status_code: SUCCESS_CREATED_ITEM.status_code,
                    message: SUCCESS_CREATED_ITEM.message
                }
            } else {
                return ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        console.error('Erro ao tentar inserir uma nova disponibilidade:', error);
        return ERROR_INTERNAL_SERVER;
    }
}


export async function criarDisponibilidadePsicologo(
    availability: TProfessionalAvailability
) {
    try {
        if (
            !availability.disponibilidade_id || !isValidId(availability.disponibilidade_id) ||
            !availability.status || typeof availability.status !== 'string' ||
            !availability.id_psicologo || !isValidId(availability.id_psicologo)
        ) {
            return ERROR_REQUIRED_FIELDS;
        }

        const validateProfessional = await getBuscarPsicologo(availability.id_psicologo)     
        
        if (validateProfessional.status_code === 404) {
            return ERROR_NOT_FOUND_PROFESSIONAL
        }

        const validateAvailbility = await getBuscarDisponibilidade(availability.disponibilidade_id)
        if (validateAvailbility.status_code === 404) {
            return ERROR_NOT_FOUND_AVAILBILITY
        }

        const searchProfessionalAvailbility = await buscarDisponibilidadePsicologo(availability)
        
        let novaDisponibilidade

        if (searchProfessionalAvailbility === false) {
            novaDisponibilidade = await criarDisponibilidadeProfissional(availability.id_psicologo, availability.disponibilidade_id, availability.status)

            if (novaDisponibilidade) {
                return {
                    data: novaDisponibilidade,
                    status_code: SUCCESS_CREATED_ITEM.status_code,
                    message: SUCCESS_CREATED_ITEM.message
                };
            } else {
                return ERROR_INTERNAL_SERVER_DB;
            }
        }
        
        else{
            // ! Se o problema for de tipo, reiniciar o vs code
            searchProfessionalAvailbility.forEach(async (searchAvailability) => { 
                if (searchAvailability.psicologo_id == availability.id_psicologo && searchAvailability.disponibilidade_id == availability.disponibilidade_id) {
                    novaDisponibilidade = await criarDisponibilidadeProfissional(availability.id_psicologo, availability.disponibilidade_id, availability.status)
                }
                else {
                    return ERROR_ALREADY_EXISTS_PREFRENCE
                }
            });
        }
  


        if (novaDisponibilidade) {
            return {
                data: {
                    data: novaDisponibilidade,
                    status_code: SUCCESS_CREATED_ITEM.status_code,
                    message: SUCCESS_CREATED_ITEM.message
                }
            };
        } else {
            return ERROR_ALREADY_EXISTS_PROFESSIONAL_AVAILBILITY;
        }
    } catch (error) {
        console.error('Erro ao tentar criar a disponibilidade:', error);
        return ERROR_INTERNAL_SERVER;
    }
}

export async function getBuscarDisponibilidade(id: number) {
    try {
        if (!isValidId(id)) {
            return ERROR_REQUIRED_FIELDS
        }
        let availabilityData = await buscarDisponibilidade(id)

        if (availabilityData === false) {
            return {
                status_code: ERROR_NOT_FOUND.status_code,
                data: ERROR_NOT_FOUND
            }
        }

        return {
            status_code: 200,
            data: availabilityData
        }

    } catch (error) {
        console.error('Erro ao tentar buscar a disponibilidade:', error);
        return ERROR_INTERNAL_SERVER;
    }
}

export async function getListarDisponibilidadesProfissional(idProfessional: number) {
    try {
        if
            (
            !isValidId(idProfessional)
        ) {
            return ERROR_REQUIRED_FIELDS
        }

        let availabilityProfessionalData = await listarDisponibilidadesPorProfissional(idProfessional)

        if (availabilityProfessionalData.id !== null) {
            return {
                data: availabilityProfessionalData,
                status_code: 200
            }
        }
        else
            return {
                data: ERROR_NOT_FOUND.message,
                status_code: 404
            }
    } catch (error) {
        console.error('Erro ao tentar consultar as disponibilidades por psicólogo:', error);
        return ERROR_INTERNAL_SERVER;
    }
}

export async function setDeletarDisponibilidade(diaSemana: string, idPsicologo: number) {
    try {
        if
            (
            !isValidWeekDay(diaSemana) || !isValidId(idPsicologo) 
        ) {
            return ERROR_REQUIRED_FIELDS
        }
        let existsAvailbility = await listarDisponibilidadesPorProfissional(idPsicologo)
        
        if (existsAvailbility.id === null || existsAvailbility.disponibilidades == "Não foram encontradas disponibilidades na requisição!!") {
            return ERROR_NOT_FOUND
        }

        let deleteAvailbility = await deletarDisponibilidade(diaSemana, idPsicologo)

        if (deleteAvailbility === false) {
            return ERROR_NOT_DELETED
        }

        return SUCCESS_DELETED_ITEM
    } catch (error) {
        console.error('Erro ao tentar deletar as disponibilidades:', error);
        return ERROR_INTERNAL_SERVER;
    }
}

export async function setAtualizarDisponibilidade(availabilityData:TAvailability, contentType: string | undefined, availabilityId: number) {
    try {
        if(String(contentType).toLowerCase() !== 'application/json'){
            return ERROR_CONTENT_TYPE
        }

        if(!isValidId(availabilityId)){
            return ERROR_INVALID_ID
        }

        const existsAvailbility = await buscarDisponibilidade(availabilityId)

        if(!existsAvailbility){
            return ERROR_NOT_FOUND
        }

        // * Os horários precisam ser enviados no formato HH:MM:SS
        if(
            !availabilityData.dia_semana || !isValidWeekDay(availabilityData.dia_semana) ||
            !availabilityData.horario_inicio || !isValidHour(availabilityData.horario_inicio.toString()) ||
            !availabilityData.horario_fim || !isValidHour(availabilityData.horario_fim.toString())
        ){
            return ERROR_REQUIRED_FIELDS
        }

        const disponibilidadeInput: TAvailability = { 
            dia_semana: availabilityData.dia_semana,
            horario_inicio: transformarHorario(availabilityData.horario_inicio.toString()),
            horario_fim: transformarHorario(availabilityData.horario_fim.toString())
        }

        let updateAvaibility = await atualizarDisponibilidade(disponibilidadeInput, availabilityId)

        if(!updateAvaibility){
            return {
                status_code: ERROR_INTERNAL_SERVER_DB.status_code,
                message: ERROR_INTERNAL_SERVER_DB.message
            }
        }

        return {
            status_code: 200,
            data: updateAvaibility
        } 

    } catch (error) {
        console.error('Erro ao tentar atualizar as disponibilidades:', error);
        return ERROR_INTERNAL_SERVER;
    }
}

export async function setAtualizarDisponibilidadeProfissional(availabilityData: TProfessionalAvailability, contentType: string | undefined) {
    try {
        if(String(contentType).toLowerCase() !== 'application/json'){
            return ERROR_CONTENT_TYPE
        }        
        
        if(!isValidId(availabilityData.disponibilidade_id)){
            return ERROR_INVALID_ID
        }

        const existsAvailbility = await buscarDisponibilidade(availabilityData.disponibilidade_id)

        if(!existsAvailbility){
            return ERROR_NOT_FOUND
        }

        if(
            !availabilityData.status || !isValidAvailbilityStatus(availabilityData.status) ||
            !availabilityData.id_psicologo || !isValidId(availabilityData.id_psicologo) ||
            !availabilityData.disponibilidade_id || !isValidId(availabilityData.disponibilidade_id)
        ){
            return ERROR_REQUIRED_FIELDS
        }        

        const existsProfessionalAvailbility = await buscarDisponibilidadePsicologo(availabilityData)

        if(!existsProfessionalAvailbility){
            return ERROR_NOT_FOUND
        }

        let updateProfessionalAvailbility = await atualizarDisponibilidadeProfissional(availabilityData)

        if(!updateProfessionalAvailbility){
            return {
                status_code: ERROR_INTERNAL_SERVER_DB.status_code,
                message: ERROR_INTERNAL_SERVER_DB.message
            }
        }

        return {
            data: updateProfessionalAvailbility,
            status_code: 200
        }


    } catch (error) {
        console.error('Erro ao tentar atualizar as disponibilidades do profissional:', error);
        return ERROR_INTERNAL_SERVER;
    }
}

export async function setDeletarDisponibilidadeByHour(dia_semana : WeekDay, horario_inicio : string, id_psicologo : number, contentType : string | undefined) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return ERROR_CONTENT_TYPE
        }
        
        if(
            !dia_semana || !isValidWeekDay(dia_semana) ||
            !horario_inicio || !isValidHour(horario_inicio) ||
            !id_psicologo || !isValidId(id_psicologo)
        ) {
            return ERROR_REQUIRED_FIELDS
        }

        let validateProfessional = await buscarPsicologo(id_psicologo)

        if(!validateProfessional){
            return ERROR_NOT_FOUND_PROFESSIONAL
        }

        let formatHour = transformarHorario(horario_inicio.toString())

        if (!formatHour) {
            return ERROR_DATE_NOT_VALID
        }

        let validateAvailbility = await buscarDisponibilidadeByHourAndWeekDay(dia_semana, formatHour, id_psicologo)
        

        if(!validateAvailbility){
            return ERROR_NOT_FOUND_AVAILBILITY
        }

        let deleteAvailbility = await deletarDisponibilidadeByHour(id_psicologo, dia_semana, formatHour)

        if(deleteAvailbility){
            return{
                data: SUCCESS_DELETED_ITEM.message,
                status_code: SUCCESS_DELETED_ITEM.status_code
            }
        }

        return{
            data: ERROR_NOT_DELETED.message,
            status_code: ERROR_NOT_DELETED.status_code
        }
    } catch (error) {
        console.error('Erro ao tentar deletar as disponibilidades do profissional:', error);
        return ERROR_INTERNAL_SERVER;
    }
}