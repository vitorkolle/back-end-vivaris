import { TProfessional } from "../../../domain/entities/professional-entity";
export declare function criarNovoPsicologo(userInput: TProfessional): Promise<{
    id: number;
    nome: string;
    email: string;
    data_nascimento: Date;
    cpf: string;
    senha: string;
    foto_perfil: string | null;
    telefone: string;
    link_instagram: string | null;
    id_sexo: number;
    price: number;
    cip: string;
    descricao: string | null;
}>;
export declare function logarPsicologo(email: string, senha: string): Promise<{
    id: number;
    nome: string;
    email: string;
    data_nascimento: Date;
    foto_perfil: string | null;
    telefone: string;
    link_instagram: string | null;
    tbl_sexo: {
        id: number;
        sexo: string | null;
    };
    cip: string;
} | {
    id: number;
    message: string;
    status_code: number;
}>;
export declare function buscarPsicologo(id: number): Promise<{
    professional: {
        tbl_psicologo_disponibilidade: {
            tbl_disponibilidade: {
                id: number;
                dia_semana: import(".prisma/client").$Enums.tbl_disponibilidade_dia_semana;
                horario_inicio: string;
                horario_fim: string;
            };
            psicologo_id: number;
        }[];
    } & {
        id: number;
        nome: string;
        email: string;
        data_nascimento: Date;
        cpf: string;
        senha: string;
        foto_perfil: string | null;
        telefone: string;
        link_instagram: string | null;
        id_sexo: number;
        price: number;
        cip: string;
        descricao: string | null;
    };
    status_code: number;
} | {
    professional: string;
    status_code: number;
}>;
export declare function listarPsicologos(): Promise<{
    data: string;
    status_code: number;
} | {
    data: {
        id: number;
        nome: string;
        email: string;
        data_nascimento: Date;
        cpf: string;
        foto_perfil: string | null;
        telefone: string;
        link_instagram: string | null;
        tbl_sexo: {
            sexo: string | null;
        };
        tbl_psicologo_disponibilidade: {
            id: number;
            tbl_disponibilidade: {
                id: number;
                dia_semana: import(".prisma/client").$Enums.tbl_disponibilidade_dia_semana;
                horario_inicio: string;
                horario_fim: string;
            };
        }[];
        cip: string;
    }[];
    status_code: number;
}>;
