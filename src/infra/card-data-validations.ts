import {PrismaClient} from "@prisma/client"
import { IVerificarDadosCartao } from "../application/card-indentification"
import { TCard } from "../domain/entities/card-entity";
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
    },

    verificarCartaoExistente: async (cardData : TCard) : Promise<TCard | null> => {
        const card = await prisma.tbl_cartoes.findUnique({
            where: {
                numero_cartao: cardData.numero_cartao,
                cvc: cardData.cvc
            }
        })

        if(card){
            return{
                modalidade: card.modalidade,
                numero_cartao: card.numero_cartao,
                nome: card.nome,
                validade: card.validade,
                cvc: card.cvc
            }
        }

        return null
    }
}