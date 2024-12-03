import { TAssessment } from "../../../domain/entities/assessment";
export declare function criarAvaliacao(avalicacao: TAssessment): Promise<false | {
    id: number;
    texto: string | null;
    avaliacao: import(".prisma/client").$Enums.tbl_avaliacoes_avaliacao | null;
    id_cliente: number;
    id_psicologo: number;
}>;
export declare function getAvaliacoesPorPsicologo(id: number): Promise<{
    id: number;
    texto: string | null;
    avaliacao: import(".prisma/client").$Enums.tbl_avaliacoes_avaliacao | null;
    id_cliente: number;
    id_psicologo: number;
}[]>;
