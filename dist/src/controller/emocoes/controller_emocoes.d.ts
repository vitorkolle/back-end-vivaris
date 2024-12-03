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
export declare function getBuscarEmocao(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    status_code: number;
    data: {
        id: number;
        data_diario: string;
        anotacoes: string | null;
        humor: import(".prisma/client").$Enums.tbl_humor_humor | null | undefined;
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
export declare function setAtualizarEmocao(emotionInput: TEmotion, diaryId: number, contentType: string | undefined): Promise<{
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
            } | null;
            id: number;
            data_diario: Date;
            anotacoes: string | null;
        };
    };
}>;
