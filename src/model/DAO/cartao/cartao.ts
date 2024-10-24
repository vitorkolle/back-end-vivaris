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