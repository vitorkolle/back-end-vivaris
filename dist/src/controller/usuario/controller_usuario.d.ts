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
    data: any;
    status_code: number;
    quantidade: any;
}>;
export declare function getBuscarSexo(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: any;
    status_code: number;
}>;
export declare function getLogarCliente(email: string | undefined, senha: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    cliente: {
        usuario: any;
        status: number;
        message: string;
    } | {
        usuario: any;
        preferencias_usuario: any[];
        status: number;
    } | {
        status: number;
        message: string;
    };
    status_code: number;
}>;
export declare function getBuscarCliente(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: any;
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
        id: any;
        nome: any;
        email: any;
        telefone: any;
        preferencias: any;
    };
    status_code: number;
}>;
