import { TUser } from "../../../domain/entities/user-entity";
export declare function criarNovoCliente(userInput: TUser): Promise<TUser>;
export declare function obterUsuarioComPreferencias(userId: number): Promise<{
    id: number;
    nome: string;
    email: string;
    telefone: string;
    preferencias: {
        id: any;
        nome: any;
        hexcolor: any;
    }[];
}>;
export declare function criarPreferenciasUsuario(userId: number, preference: number): Promise<{
    id: number;
    nome: string;
    email: string;
    telefone: string;
    preferencias: {
        id: any;
        nome: any;
        cor: any;
    }[];
}>;
export declare function logarCliente(email: string, senha: string): Promise<{
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
}>;
export declare function buscarCliente(id: number): Promise<{
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
} | null>;
