export declare function selectAppointment(id: number): Promise<{
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
}>;
export declare function createAppointment(idProfessional: number, idClient: number, data: Date): Promise<false | {
    id: number;
    avaliacao: import(".prisma/client").$Enums.tbl_consultas_avaliacao;
    id_cliente: number;
    id_psicologo: number;
    data_consulta: Date;
    valor: number;
}>;
export declare function deleteAppointment(id: number): Promise<boolean>;
