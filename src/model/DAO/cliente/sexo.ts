import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()


export async function getAllSexos(){
    try{
        const sexos = await prisma.tbl_sexo.findMany({
            select: {
                id: true,
                sexo: true,
            }
        })
        return sexos;
    }catch(error){
        console.error("Error acessando todos os sexos", error);
        throw error;
    }
}

export async function getSexoById(sexoId: number){
    try{
        const sexo = await prisma.tbl_sexo.findUnique({
            where: {
                id : sexoId,
            },
            select: {
                id: true,
                sexo: true,
            }
        })
        if(!sexo){
            throw new Error("Sexo não encontrado");
        }
        return sexo;
    }catch(error){
        console.error("Error acessando o sexo por ID", error);
        throw error;
    }
}