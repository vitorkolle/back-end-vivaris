import { TEmotion } from "../../domain/entities/emotion-entity";
export declare function setCriarEmocao(emocao: TEmotion, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    status_code: number;
    data: {
        id: number;
        data_diario: string;
        anotacoes: string | null;
        humor: import(".prisma/client").$Enums.tbl_humor_humor | null;
        cliente: {
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
        } | null;
    };
}>;
