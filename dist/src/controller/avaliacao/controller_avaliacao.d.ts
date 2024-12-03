import { TAssessment } from "../../domain/entities/assessment";
export declare function setCadastrarAvaliacao(avaliacao: TAssessment, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    message: string;
    status_code: number;
    data?: undefined;
} | {
    data: {
        id: number;
        texto: string | null;
        avaliacao: import(".prisma/client").$Enums.tbl_avaliacoes_avaliacao | null;
        id_cliente: number;
        id_psicologo: number;
    };
    status_code: number;
    message?: undefined;
}>;
export declare function getBuscarAvaliacoesPorPsicologo(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        id: number;
        texto: string | null;
        avaliacao: import(".prisma/client").$Enums.tbl_avaliacoes_avaliacao | null;
        id_cliente: number;
        id_psicologo: number;
    }[];
    status_code: number;
}>;
