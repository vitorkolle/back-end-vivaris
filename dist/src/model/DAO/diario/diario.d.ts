import { TDiary } from "../../../domain/entities/diary-entity";
export declare function updateDiario(diaryInput: TDiary, diaryId: number): Promise<false | {
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
}>;
export declare function deleteDiario(id: number): Promise<boolean>;
export declare function buscarDiario(id: number): Promise<false | {
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
}>;
