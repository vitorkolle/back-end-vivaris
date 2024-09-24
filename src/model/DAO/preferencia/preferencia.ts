import { PrismaClient } from "@prisma/client"
import { ERROR_NOT_FOUND } from "../../../../module/config";
import { TPreference } from "../../../domain/entities/preference-entity";
const prisma = new PrismaClient()


export async function listarPreferencias() {
    try {
        const preferences = await prisma.tbl_preferencias.findMany({
            select: {
                id: true,
                cor: true,
                nome: true
            },
        }) 
        return preferences
    } catch (error) {
        console.error("Erro acessando todas as preferências", error);
        throw error;
    }
} 