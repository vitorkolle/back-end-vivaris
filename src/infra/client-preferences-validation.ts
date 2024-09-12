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
    alreadyExists: async (idCliente: number): Promise<boolean> => {
        const preferences = await prisma.tbl_clientes.findMany({
            where: { id: idCliente }, 
        });

        return preferences === null
    }

}
