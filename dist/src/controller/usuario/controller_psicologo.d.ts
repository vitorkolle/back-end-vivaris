import { TProfessional } from "../../domain/entities/professional-entity";
export declare function setInserirPsicologo(user: TProfessional, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    user: {
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
        cip: string;
    };
    status_code: number;
    message: string;
}>;
export declare function getLogarPsicologo(email: string | null, senha: string | null): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        status: boolean;
        status_code: number;
        message: string;
    } | {
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
    };
    status_code: number;
}>;
export declare function getBuscarPsicologo(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
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
            email: string;
            data_nascimento: Date;
            cpf: string;
            senha: string;
            foto_perfil: string | null;
            telefone: string;
            link_instagram: string | null;
            id_sexo: number;
            cip: string;
        };
        status_code: number;
    } | {
        professional: string;
        status_code: number;
    };
    status_code: number;
    status: boolean;
} | {
    data: string;
    status_code: number;
    status: boolean;
}>;
