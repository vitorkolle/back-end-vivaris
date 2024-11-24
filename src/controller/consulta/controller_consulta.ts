import { ERROR_CONTENT_TYPE, ERROR_INTERNAL_SERVER, ERROR_INTERNAL_SERVER_DB, ERROR_INVALID_ID, ERROR_NOT_DELETED, ERROR_NOT_FOUND, ERROR_NOT_FOUND_CLIENT, ERROR_NOT_FOUND_PROFESSIONAL, ERROR_REQUIRED_FIELDS, SUCCESS_DELETED_ITEM, SUCCESS_UPDATED_ITEM } from "../../../module/config";
import { isValidId } from "../../infra/zod-validations";
import { buscarCliente } from "../../model/DAO/cliente/usuario";
import { createAppointment, deleteAppointment, selectAppointment, updateAppointment } from "../../model/DAO/consulta/consulta";
import { buscarPsicologo } from "../../model/DAO/psicologo/usuario";

export async function setCadastrarConsulta(idProfessional: number, idClient: number, data: Date, contentType: string | undefined) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return ERROR_CONTENT_TYPE
        }

        function validarData(data: string): boolean {
            console.log(data)

            if (data.length !== 16) return false;

            const partes = data.split(" ");

            const anomesdia = partes[0];
            const hora = partes[1];

            const partesAnomesdia = anomesdia.split("-")
            const ano = parseInt(partesAnomesdia[0])
            const mes = parseInt(partesAnomesdia[1])
            const dia = parseInt(partesAnomesdia[2])

            if (mes < 1 || mes > 12) {
                console.log('é isso');
                
                return false;
            }


            const dataTestada = new Date(`${anomesdia}T${hora}:00.000z`);
            console.log(dataTestada)
            return dataTestada.getFullYear() === ano && dataTestada.getMonth() === mes - 1 && dataTestada.getDate() === dia;
        }

        function transformarData(data: string): Date {
            if (!validarData(data)) {
                
                throw new Error("Formato de data inválido");
            }

            const partes = data.split(" ");

            const anomesdia = partes[0];
            const hora = partes[1];

            const partesAnomesdia = anomesdia.split("-")
            data = data.replace(" ", "T")
            
            const myDate = new Date(`${anomesdia}T${hora}:00.000z`)
 
            return myDate;
        
        }

        if
            (
            !isValidId(idProfessional) || !isValidId(idClient) || !validarData(data.toString()) || !transformarData(data.toString())
        ) {

            console.log(isValidId(idProfessional));
            console.log(isValidId(idClient));
            console.log(validarData(data.toString()));
            console.log(transformarData(data.toString()));
          
            return ERROR_REQUIRED_FIELDS
        }


        let validateClient = await buscarCliente(idClient)

        if (!validateClient) {
            return ERROR_NOT_FOUND_CLIENT
        }

        let validateProfessional = await buscarPsicologo(idProfessional)

        if (!validateProfessional) {
            return ERROR_NOT_FOUND_PROFESSIONAL
        }

        let newAppointment = await createAppointment(idProfessional, idClient, transformarData(data.toString()))

        if (!newAppointment) {
            return ERROR_INTERNAL_SERVER_DB
        }

        return {
            data: newAppointment,
            status_code: 201
        }
    } catch (error) {
        console.error('Erro ao tentar inserir uma nova consulta:', error);
        return ERROR_INTERNAL_SERVER;
    }
}


export async function getBuscarConsulta(id: number) {
    if (!isValidId(id)) {
        return ERROR_INVALID_ID
    }

    let getAppointment = await selectAppointment(id)

    if (getAppointment) {
        return {
            data: getAppointment,
            status_code: 200
        }
    }

    return ERROR_NOT_FOUND
}

export async function setDeletarConsulta(id: number) {
    try {
        if (!isValidId(id)) {
            return ERROR_INVALID_ID
        }
    
        let appointment = await deleteAppointment(id)
    
        if (!appointment) {
            return ERROR_NOT_DELETED
        }
    
        return {
            data: SUCCESS_DELETED_ITEM.message,
            status_code: 200
        }
    } catch (error) {
        console.error('Erro ao tentar deletar a consulta:', error);
        return ERROR_INTERNAL_SERVER;
    }
   
}

export async function setAtualizarConsulta(id: number, data: Date, contentType: string | undefined) {
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

        if 
        (
            !isValidId(id) || !validarData(data.toString()) || !transformarData(data.toString())
        ) {
            return ERROR_CONTENT_TYPE
        }

        let validateAppointment = await selectAppointment(id)

        if (!validateAppointment) {
            return ERROR_NOT_FOUND
        }

        let appointment = await updateAppointment(transformarData(data.toString()), id)

        if (!appointment) {
            return{
                data: ERROR_INTERNAL_SERVER_DB.message,
                status_code: 500
            }
        }

        return{
            data: SUCCESS_UPDATED_ITEM.message,
            status_code: 200
        }
    } catch (error) {
        console.error('Erro ao tentar atualizar a consulta:', error);
        return ERROR_INTERNAL_SERVER;
    }    
}