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