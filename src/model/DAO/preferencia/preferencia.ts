import { PrismaClient } from "@prisma/client"
import { ERROR_NOT_FOUND } from "../../../../module/config";
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

export async function buscarPreferencia(id:number) {
    try {
        const preference = await prisma.tbl_preferencias.findUnique({
            select: {
                id: true,
                cor: true,
                nome: true
            },
            where: {
                id: id
            }
        })
        return preference
    } catch (error) {
        console.error("Erro buscando preferencia", error);
        throw error;
    }
}