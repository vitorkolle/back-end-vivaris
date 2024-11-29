import { TAppointment } from "../../../domain/entities/appointment-entity";
export declare function selectAppointment(id: number): Promise<TAppointment | false>;
export declare function selectAppointmentByProfessional(id: number): Promise<TAppointment[] | false>;
export declare function createAppointment(idProfessional: number, idClient: number, data: Date): Promise<false | {
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
}>;
export declare function deleteAppointment(id: number): Promise<boolean>;
export declare function updateAppointment(data: Date, id: number): Promise<boolean>;
export declare function selectAppointmentByUserId(id_usuario: number): Promise<false | {
    tbl_clientes: {
        id: number;
        nome: string;
        email: string;
        data_nascimento: Date;
        foto_perfil: string | null;
        telefone: string;
        link_instagram: string | null;
        tbl_sexo: {
            sexo: string | null;
        } | null;
    };
    id: number;
    tbl_psicologos: {
        id: number;
        nome: string;
        email: string;
        data_nascimento: Date;
        foto_perfil: string | null;
        telefone: string;
        link_instagram: string | null;
        tbl_avaliacoes: {
            avaliacao: import(".prisma/client").$Enums.tbl_avaliacoes_avaliacao | null;
        }[];
        tbl_sexo: {
            sexo: string | null;
        };
        descricao: string | null;
        preco: number;
    };
    avaliacao: import(".prisma/client").$Enums.tbl_consultas_avaliacao;
    data_consulta: Date;
    valor: number;
}[]>;
