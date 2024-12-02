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