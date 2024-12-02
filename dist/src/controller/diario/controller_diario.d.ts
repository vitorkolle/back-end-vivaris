import { TDiary } from "../../domain/entities/diary-entity";
export declare function setAtualizarDiario(diarioInput: TDiary, id: number, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    status_code: number;
    data: {
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
        tbl_humor: {
            id: number;
            humor: import(".prisma/client").$Enums.tbl_humor_humor | null;
        } | null;
    };
}>;
export declare function setDeletarDiario(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    status_code: number;
    message: string;
}>;
