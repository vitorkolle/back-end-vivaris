import { TCard } from "../../../domain/entities/card-entity";
export declare function cadastrarCartao(cardData: TCard): Promise<{
    id: number;
    modalidade: import(".prisma/client").$Enums.tbl_cartoes_modalidade;
    nome: string;
    numero_cartao: string;
    cvc: string;
    validade: Date;
}>;
export declare function buscarCartao(cardId: number): Promise<{
    id: number;
    modalidade: import(".prisma/client").$Enums.tbl_cartoes_modalidade;
    nome: string;
    numero_cartao: string;
    cvc: string;
    validade: Date;
} | null>;
export declare function deletarCartao(cardId: number): Promise<boolean>;
export declare function buscarCartaoPorCliente(cardId: number): Promise<{
    tbl_cartoes: {
        id: number;
        modalidade: import(".prisma/client").$Enums.tbl_cartoes_modalidade;
        nome: string;
        numero_cartao: string;
        cvc: string;
        validade: Date;
    };
    id_cliente: number;
    id_cartao: number;
    tbl_clientes: {
        id: number;
        nome: string;
        email: string;
        data_nascimento: Date;
        cpf: string;
        senha: string;
        foto_perfil: string | null;
        telefone: string;
        link_instagram: string | null;
        id_sexo: number | null;
    };
}[] | undefined>;
