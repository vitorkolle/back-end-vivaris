import { TCard } from "../../domain/entities/card-entity";
export declare function setCadastrarCartao(cardData: TCard, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    card: any;
    status_code: number;
}>;
export declare function getBuscarCartao(cardId: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    card: any;
    status_code: number;
}>;
export declare function setDeletarCartao(cardId: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
}>;
