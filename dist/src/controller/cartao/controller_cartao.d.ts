import { TCard } from "../../domain/entities/card-entity";
export declare function setCadastrarCartao(cardData: TCard, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    card: {
        id: number;
        modalidade: import(".prisma/client").$Enums.tbl_cartoes_modalidade;
        nome: string;
        numero_cartao: string;
        cvc: string;
        validade: Date;
    };
    status_code: number;
} | {
    card: {
        status: boolean;
        status_code: number;
        message: string;
    };
    status_code: number;
}>;
