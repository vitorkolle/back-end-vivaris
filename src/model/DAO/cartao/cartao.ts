import { PrismaClient } from "@prisma/client"
import { TCard } from "../../../domain/entities/card-entity"
const prisma = new PrismaClient()

export async function cadastrarCartao(cardData: TCard) {
    try {
        const card = await prisma.tbl_cartoes.create({
            data: {
                modalidade: cardData.modalidade,
                numero_cartao: cardData.numero_cartao,
                nome: cardData.nome,
                validade: cardData.validade,
                cvc: cardData.cvc
            },
        })

        return card
    }
    catch (error) {
        console.error("Erro ao criar novo cliente:", error);
        throw new Error("Não foi possível criar o cliente.");
    }

}

export async function buscarCartao(cardId:number) {
    try {
        const card = await prisma.tbl_cartoes.findUnique({
            where: {
                id: cardId
            }
        })

        return card
    } catch (error) {
        console.error("Erro ao buscar cartao:", error);
        throw new Error("Não foi possível buscar o cartao");
    }
}

export async function deletarCartao(cardId:number) {
    try {
        const card = await prisma.tbl_cartoes.delete({
            where: {
                id: cardId
            }
        })

        if(!card){
            return false
        }

        return true
    } catch (error) {
        console.error("Erro ao deletar cartao", error);
        throw new Error("Não foi possível buscar o cartao");
    }    
}

export async function buscarCartaoPorCliente(cardId:number){
    try {
        const card = await prisma.tbl_cliente_cartao.findMany({
            where: {
                id: cardId
            },
            select: {
                id_cartao: true,
                tbl_cartoes:true,
                id_cliente: true,
                tbl_clientes: true
            }
        })

        if(card) return card

    } catch(error){
        console.error("Erro ao buscar cartao por cliente:", error);
        throw new Error("Não foi possível buscar o cartao");
    }
}