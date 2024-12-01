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

export async function validarEmocao(emotionInput : TEmotion){
    try {
        let mood = await prisma.tbl_diario.findFirst({
            where : {
                data_diario : emotionInput.data,
                id_cliente : emotionInput.id_cliente
            }
        })

        if(!mood){
            return false
        }

        return true
    } catch (error) {
        console.error("Erro ao validar emocao:", error)
        throw new Error("Erro ao validar emocao")
    }
    
}

export async function buscarEmocao(id:number) {
    try {
        let emotion = await prisma.tbl_diario.findUnique({
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

        if(!emotion){
            return false
        }

        return{
            id: emotion.id,
            data_diario: emotion.data_diario.toISOString().split('T')[0],
            anotacoes: emotion.anotacoes,
            humor: emotion.tbl_humor?.humor,
            cliente: emotion.tbl_clientes
        }
    } catch (error) {
        console.error("Erro ao buscar emocao:", error);
        throw new Error("Erro ao buscar emocao");
    }
}
