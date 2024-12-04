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
        descricao: string | null;
        preco: number;
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
    };
    token: string | boolean;
    status_code: number;
}>;
export declare function getBuscarPsicologo(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        professional: {
            tbl_avaliacoes: {
                tbl_clientes: {
                    id: number;
                    nome: string;
                    email: string;
                    foto_perfil: string | null;
                };
                id: number;
                texto: string | null;
                avaliacao: import(".prisma/client").$Enums.tbl_avaliacoes_avaliacao | null;
            }[];
            tbl_psicologo_disponibilidade: {
                psicologo_id: number;
                tbl_disponibilidade: {
                    id: number;
                    dia_semana: import(".prisma/client").$Enums.tbl_disponibilidade_dia_semana;
                    horario_inicio: string;
                    horario_fim: string;
                };
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
            descricao: string | null;
            preco: number;
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
export declare function getListarPsicologos(): Promise<{
    data: {
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
            cip: string;
            tbl_psicologo_disponibilidade: {
                id: number;
                tbl_disponibilidade: {
                    id: number;
                    dia_semana: import(".prisma/client").$Enums.tbl_disponibilidade_dia_semana;
                    horario_inicio: string;
                    horario_fim: string;
                };
            }[];
        }[];
        status_code: number;
    };
    status_code: number;
    status: boolean;
} | {
    data: string;
    status_code: number;
    status: boolean;
}>;
export declare function setAtualizarPsicologo(user: TProfessional, contentType: string | undefined, id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: true | TProfessional;
    status_code: number;
}>;
