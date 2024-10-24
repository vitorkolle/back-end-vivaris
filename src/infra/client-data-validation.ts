import { IVerificarDadosPessoais } from "../application/client-identification"
import {PrismaClient} from "@prisma/client"
const prisma = new PrismaClient()

export const verificacao: IVerificarDadosPessoais = {
    verificarEmail: async (emailInput: string): Promise<boolean> => {
       
        const client = await prisma.tbl_clientes.findUnique({
            where: { email: emailInput },
        });
    
        return client === null;
    },
    verificarCpf: async (cpfInput: string): Promise<boolean> => {
        const client = await prisma.tbl_clientes.findUnique({
            where: { cpf: cpfInput },
        });
        
        return client === null;
    }
}
