import { TUser } from "../../domain/entities/user-entity";
export declare function setInserirUsuario(user: TUser, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    user: TUser;
    status_code: number;
    message: string;
}>;
export declare function getListarSexo(): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        id: number;
        sexo: string | null;
    }[];
    status_code: number;
    quantidade: number;
}>;
export declare function getBuscarSexo(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        id: number;
        sexo: string | null;
    };
    status_code: number;
}>;
export declare function getLogarCliente(email: string | undefined, senha: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    cliente: {
        id: number;
        usuario: {
            id: number;
            nome: string;
            data_nascimento: Date;
            foto_perfil: string | null;
            telefone: string;
        };
        status: number;
        message: string;
    } | {
        id: number;
        usuario: {
            id: number;
            nome: string;
            data_nascimento: Date;
            foto_perfil: string | null;
            telefone: string;
        };
        preferencias_usuario: {
            id: number;
            nome: string;
            cor: string;
        }[][];
        status: number;
    } | {
        id: number;
        status: number;
        message: string;
    };
    token: string | boolean;
    status_code: number;
}>;
export declare function getBuscarCliente(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
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
    status_code: number;
} | {
    data: string;
    status_code: number;
}>;
export declare function getBuscarClientePreferencias(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: string;
    status_code: number;
} | {
    data: {
        id: number;
        nome: string;
        email: string;
        telefone: string;
        preferencias: {
            id: any;
            nome: any;
            hexcolor: any;
        }[];
    };
    status_code: number;
}>;
