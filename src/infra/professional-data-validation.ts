import { PrismaClient } from "@prisma/client"
import { IVerificarDadosProfissionais } from "../application/professional-identification";
const prisma = new PrismaClient()

export const verificacaoProfissionais: IVerificarDadosProfissionais = {
    verificarCip: async (cipInput: string): Promise<boolean> => {
        const client = await prisma.tbl_psicologos.findUnique({
            where: { cip: cipInput },
        });
        
        return client === null;
    },

    verificarEmail: async (emailInput: string): Promise<boolean> => {
       
        const client = await prisma.tbl_psicologos.findUnique({
            where: { email: emailInput },
        });
    
        return client === null;
    },

    verificarCpf: async (cpfInput: string): Promise<boolean> => {
        const client = await prisma.tbl_psicologos.findUnique({
            where: { cpf: cpfInput },
        });
        
        return client === null;
    }
}