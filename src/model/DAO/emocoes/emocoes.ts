import { PrismaClient } from "@prisma/client";
import { TEmotion } from "../../../domain/entities/emotion-entity";
const prisma = new PrismaClient();

export async function createEmocao(emotionInput : TEmotion){
    try {

        let mood = await prisma.tbl_humor.findFirst({
            where : {
                humor : emotionInput.emocao
            }
        })

        if(!mood){
            return false
        }

        let emotion = await prisma.tbl_diario.create({
            data : {
                data_diario : emotionInput.data,
                id_humor: mood.id,
                id_cliente: emotionInput.id_cliente
            },
            select : {
                id : true,
                data_diario : true,
                anotacoes : true,
                tbl_clientes : true
            }
        })

        if(!emotion){
            return false
        }

        return{
            id: emotion.id,
            data_diario: emotion.data_diario.toISOString().split('T')[0],
            anotacoes: emotion.anotacoes,
            humor: mood.humor,
            cliente: emotion.tbl_clientes
        }
    } catch (error) {
        console.error("Erro ao criar nova emocao:", error);
        throw new Error("Não foi possível criar a emocao");
    }
}
