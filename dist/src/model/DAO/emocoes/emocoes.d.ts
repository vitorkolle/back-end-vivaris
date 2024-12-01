import { TEmotion } from "../../../domain/entities/emotion-entity";
export declare function createEmocao(emotionInput: TEmotion): Promise<false | {
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
}>;
export declare function validarEmocao(emotionInput: TEmotion): Promise<boolean>;
export declare function buscarEmocao(id: number): Promise<false | {
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
    tbl_humor: {
        id: number;
        humor: import(".prisma/client").$Enums.tbl_humor_humor | null;
    } | null;
    data_diario: Date;
    anotacoes: string | null;
}>;
