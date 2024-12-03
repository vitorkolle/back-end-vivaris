import { PrismaClient } from "@prisma/client";
import { TDiary } from "../../../domain/entities/diary-entity";
const prisma = new PrismaClient();

export async function updateDiario(diaryInput : TDiary, diaryId : number){
    try {
        let diary = await prisma.tbl_diario.update({
            where: {
                id: diaryId
            },
            data:{
                data_diario: diaryInput.data_diario,
                anotacoes: diaryInput.anotacoes,
                id_humor: diaryInput.id_humor,
                id_cliente: diaryInput.id_cliente
            },
            select:{
                id: true,
                data_diario: true,
                anotacoes: true,
                tbl_clientes: true,
                tbl_humor: true
            }
        })

        if (!diary) {
            return false
        }

        return diary
    } catch (error) {
        console.error("Erro ao atualizar diario:", error);
        throw new Error("Erro ao atualizar diario");
    }
}

export async function deleteDiario(id : number) {
    try {
        let sql = `CALL deleteDiario(${id})`
        let diary = await prisma.$queryRawUnsafe(sql)

        if (!diary) {
            return false
        }

        return true
    } catch (error) {
        console.error("Erro ao deletar diario:", error)
        throw new Error("Erro ao deletar diario")
    }
}

export async function buscarDiario(id : number) {
    try {
        let diary = await prisma.tbl_diario.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                data_diario: true,
                anotacoes: true,
                tbl_clientes: true,
                tbl_humor: true
            }
        })

        if (!diary) {
            return false
        }

        return diary
    } catch (error) {
        console.error("Erro ao buscar diario:", error)
        throw new Error("Erro ao buscar diario")
    }
}