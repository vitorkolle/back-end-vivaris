import { PrismaClient } from "@prisma/client";
import { IVerificarPreferencias } from "../application/client-preferences-validation";
const prisma = new PrismaClient()

export const verificarPreferencias: IVerificarPreferencias = {
    isValid: async (preferenceId: number): Promise<boolean> => {

        const preference = await prisma.tbl_preferencias.findUnique({
            where: { id: preferenceId },
        });
        
        return preference === null
    },
    alreadyExists: async (preferenceId: number, id_cliente:number): Promise<boolean> => {
        const preferences = await prisma.tbl_clientes_preferencias.findFirst({
            where: { 
                id_preferencias: preferenceId,
                id_clientes: id_cliente
            }, 
        });
        console.log(preferences);
        
        return preferences === null
    }

}
