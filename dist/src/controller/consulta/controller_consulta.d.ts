export declare function setCadastrarConsulta(idProfessional: number, idClient: number, data: Date, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        consulta: {
            id: number;
            avaliacao: import(".prisma/client").$Enums.tbl_consultas_avaliacao;
            id_cliente: number;
            id_psicologo: number;
            data_consulta: Date;
            valor: number;
        };
        psicologo: {
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
        };
    };
    status_code: number;
}>;
export declare function getBuscarConsulta(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
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
            tbl_sexo: {
                id: number;
                sexo: string | null;
            } | null;
        };
        id: number;
        tbl_psicologos: {
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
            tbl_sexo: {
                id: number;
                sexo: string | null;
            };
            cip: string;
            preco: number;
        };
        avaliacao: import(".prisma/client").$Enums.tbl_consultas_avaliacao;
        data_consulta: Date;
        valor: number;
    };
    status_code: number;
}>;
export declare function setDeletarConsulta(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: string;
    status_code: number;
}>;
export declare function setAtualizarConsulta(id: number, data: Date, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: string;
    status_code: number;
} | {
    data: true;
    status_code: number;
}>;
