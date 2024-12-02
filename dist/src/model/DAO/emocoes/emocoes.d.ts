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
export declare function selectEmocao(id: number): Promise<false | {
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
}>;
export declare function updateEmocao(emotionInput: TEmotion, diaryId: number): Promise<false | {
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
}>;
