import { criarDisponibilidade, criarDisponibilidadeProfissional } from "../../model/DAO/disponibilidade/disponibilidade";
import { ERROR_CONTENT_TYPE, ERROR_INTERNAL_SERVER, ERROR_INTERNAL_SERVER_DB, ERROR_NOT_CREATED, ERROR_NOT_FOUND, ERROR_REQUIRED_FIELDS, SUCCESS_CREATED_ITEM } from "../../../module/config"
import { DayOfWeek, TAvailability } from "../../domain/entities/availability-entity";
import { verificacao } from "../../infra/availability-data-validation";
import { TProfessionalAvailability } from "../../domain/entities/professional-availability";

 
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
        if(!disponibilidade.dia_semana || disponibilidade.dia_semana.length > 7 || disponibilidade.dia_semana.length < 5 || typeof disponibilidade.dia_semana !== 'string' || !verificacao.isDayOfWeek(disponibilidade.dia_semana)||
            !disponibilidade.horario_inicio ||  !verificacao.verificarHorario(disponibilidade.horario_inicio.toString()) || 
            !disponibilidade.horario_fim || !verificacao.verificarHorario(disponibilidade.horario_fim.toString())
        ) {
            return ERROR_REQUIRED_FIELDS
        }else{

            const disponibilidadeInput: TAvailability = {
                dia_semana: disponibilidade.dia_semana,
                horario_inicio: transformarHorario(disponibilidade.horario_inicio.toString()),
                horario_fim: transformarHorario(disponibilidade.horario_fim.toString())
            }

            const newAvailability = await criarDisponibilidade(disponibilidadeInput)
            if(newAvailability){
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
    availability : TProfessionalAvailability
) {
    try {
        if (!availability.disponibilidade_id ||typeof availability.disponibilidade_id !== 'number' || !availability.status ||!availability.id_psicologo) {
            return ERROR_REQUIRED_FIELDS;
        }

        const novaDisponibilidade = await criarDisponibilidadeProfissional(availability.disponibilidade_id, availability.id_psicologo, availability.status);

        if (novaDisponibilidade) {
            return {
                data: novaDisponibilidade,
                status_code: SUCCESS_CREATED_ITEM.status_code,
                message: SUCCESS_CREATED_ITEM.message
            };
        } else {
            return ERROR_INTERNAL_SERVER;
        }
    } catch (error) {
        console.error('Erro ao tentar criar a disponibilidade:', error);
        return ERROR_INTERNAL_SERVER;
    }
}