import {PrismaClient} from "@prisma/client"
import { IVerificarDadosCartao } from "../application/card-indentification"
const prisma = new PrismaClient()

export const verificacao : IVerificarDadosCartao = {

    verificarCvcCartao: async (cvc: string):Promise<boolean> => {
        const card = await prisma.tbl_cartoes.findUnique({
            where:{
                cvc: cvc
            }
        });

        return card === null
    },

    verificarNumeroCartao: async (numeroCartao : string) : Promise<boolean> => {
        const card = await prisma.tbl_cartoes.findUnique({
            where:{
                numero_cartao: numeroCartao
            }
        });

        return card === null
    }
}