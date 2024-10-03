import { buscarDisponibilidade, buscarDisponibilidadePsicologo, criarDisponibilidade, criarDisponibilidadeProfissional, deletarDisponibilidade, listarDisponibilidadesPorProfissional } from "../../model/DAO/disponibilidade/disponibilidade";
import { ERROR_ALREADY_EXISTS_PREFRENCE, ERROR_ALREADY_EXISTS_PROFESSIONAL_AVAILBILITY, ERROR_CONTENT_TYPE, ERROR_INTERNAL_SERVER, ERROR_INTERNAL_SERVER_DB, ERROR_NOT_CREATED, ERROR_NOT_DELETED, ERROR_NOT_FOUND, ERROR_NOT_FOUND_AVAILBILITY, ERROR_NOT_FOUND_PROFESSIONAL, ERROR_REQUIRED_FIELDS, SUCCESS_CREATED_ITEM, SUCCESS_DELETED_ITEM } from "../../../module/config"
import { DayOfWeek, TAvailability } from "../../domain/entities/availability-entity";
import { verificacao } from "../../infra/availability-data-validation";
import { TProfessionalAvailability } from "../../domain/entities/professional-availability";
import { getBuscarPsicologo } from "../usuario/controller_psicologo";
import { z } from "zod";
import { isValidId } from "../../infra/zod-validations";


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
        if (!disponibilidade.dia_semana || disponibilidade.dia_semana.length > 7 || disponibilidade.dia_semana.length < 5 || typeof disponibilidade.dia_semana !== 'string' || !verificacao.isDayOfWeek(disponibilidade.dia_semana) ||
            !disponibilidade.horario_inicio || !verificacao.verificarHorario(disponibilidade.horario_inicio.toString()) ||
            !disponibilidade.horario_fim || !verificacao.verificarHorario(disponibilidade.horario_fim.toString())
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
            !availability.disponibilidade_id || typeof availability.disponibilidade_id !== 'number' ||
            !availability.status || typeof availability.status !== 'string' ||
            !availability.id_psicologo || typeof availability.id_psicologo !== 'number'
        ) {
            return ERROR_REQUIRED_FIELDS;
        }

        const validateProfessional = await getBuscarPsicologo(availability.id_psicologo)
        if (validateProfessional.status == false) {
            return ERROR_NOT_FOUND_PROFESSIONAL
        }

        const validateAvailbility = await getBuscarDisponibilidade(availability.disponibilidade_id)
        console.log(validateAvailbility);

        if (!validateAvailbility) {
            return ERROR_NOT_FOUND_AVAILBILITY
        }

        const searchProfessionalAvailbility = await buscarDisponibilidadePsicologo(availability.id_psicologo, availability.disponibilidade_id)

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

        searchProfessionalAvailbility.forEach(async (searchAvailability: { psicologo_id: number; disponibilidade_id: number; status_disponibilidade: string; }) => {
            if (searchAvailability.psicologo_id == availability.id_psicologo && searchAvailability.disponibilidade_id == availability.disponibilidade_id && (searchAvailability.status_disponibilidade == 'Concluido' || searchAvailability.status_disponibilidade == 'Livre')) {
                novaDisponibilidade = await criarDisponibilidadeProfissional(availability.id_psicologo, availability.disponibilidade_id, availability.status)
            }
            else {
                return ERROR_ALREADY_EXISTS_PREFRENCE
            }
        });

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

        if (availabilityProfessionalData.id !== false) {
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
            typeof diaSemana !== 'string' || !verificacao.isDayOfWeek(diaSemana) ||
           !isValidId(idPsicologo)
        ) {
            return ERROR_REQUIRED_FIELDS
        }

        let deleteAvailbility = await deletarDisponibilidade(diaSemana, idPsicologo)

        console.log(deleteAvailbility);


        if (deleteAvailbility === false) {
            return ERROR_NOT_DELETED
        }

        return SUCCESS_DELETED_ITEM
    } catch (error) {
        console.error('Erro ao tentar deletar as disponibilidades:', error);
        return ERROR_INTERNAL_SERVER;
    }
}