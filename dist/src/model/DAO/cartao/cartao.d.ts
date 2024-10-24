import { TCard } from "../../../domain/entities/card-entity";
export declare function cadastrarCartao(cardData: TCard): Promise<{
    id: number;
    modalidade: import(".prisma/client").$Enums.tbl_cartoes_modalidade;
    nome: string;
    numero_cartao: string;
    cvc: string;
    validade: Date;
}>;
