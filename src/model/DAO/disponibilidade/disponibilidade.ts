import { PrismaClient } from "@prisma/client"
import { TAvailability } from "../../../domain/entities/availability-entity"
const prisma = new PrismaClient()

export async function criarDisponibilidade(disponibilidade: TAvailability): Promise<TAvailability> {
    try {
        const newAvailability = await prisma.tbl_disponibilidade.create({
          data: {
            dia_semana: disponibilidade.day,
            horario_inicio: disponibilidade.from,
            horario_fim: disponibilidade.to,
          }, 
        });
    
        return newAvailability;
    
      } catch (error) {
        console.error("Erro ao criar nova disponibilidade:", error);
        throw new Error("Não foi possível criar a dipsonibilidade.");
      }
}