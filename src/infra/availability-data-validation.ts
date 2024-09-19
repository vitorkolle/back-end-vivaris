import { IVerificarDadosDisponibilidade } from "../application/availability-validation";
import { DayOfWeek } from "../domain/entities/availability-entity";
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export const verificacao: IVerificarDadosDisponibilidade = {
    isDayOfWeek: (dia: string): boolean => {
        const diasValidos: DayOfWeek[] = ["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado", "Domingo"];

        return diasValidos.includes(dia as DayOfWeek);
    },

    verificarHorario: async (horarioInput: string): Promise<boolean> => {
        const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d$)/; 

        if (!horarioRegex.test(horarioInput)) {
            return false;
        }
         return true;
    }
}