import { TProfessional } from "../../../domain/entities/professional-entity";
export declare function criarNovoPsicologo(userInput: TProfessional): Promise<{
    id: number;
    nome: string;
    data_nascimento: Date;
    cip: string;
    cpf: string;
    email: string;
    senha: string;
    telefone: string;
    foto_perfil: string | null;
    link_instagram: string | null;
    id_sexo: number;
}>;
export declare function logarPsicologo(email: string, senha: string): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    id: number;
    nome: string;
    data_nascimento: Date;
    cip: string;
    email: string;
    telefone: string;
    foto_perfil: string | null;
    link_instagram: string | null;
    tbl_sexo: {
        id: number;
        sexo: string | null;
    };
}>;
export declare function buscarPsicologo(id: number): Promise<{
    professional: {
        tbl_psicologo_disponibilidade: {
            tbl_disponibilidade: {
                id: number;
                dia_semana: import(".prisma/client").$Enums.tbl_disponibilidade_dia_semana;
                horario_inicio: Date;
                horario_fim: Date;
            };
            psicologo_id: number;
        }[];
    } & {
        id: number;
        nome: string;
        data_nascimento: Date;
        cip: string;
        cpf: string;
        email: string;
        senha: string;
        telefone: string;
        foto_perfil: string | null;
        link_instagram: string | null;
        id_sexo: number;
    };
    status_code: number;
} | {
    professional: string;
    status_code: number;
}>;
