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
    usuario: {
        id: number;
        nome: string;
        data_nascimento: Date;
        telefone: string;
        foto_perfil: string | null;
    };
    status: number;
    message: string;
} | {
    usuario: {
        id: number;
        nome: string;
        data_nascimento: Date;
        telefone: string;
        foto_perfil: string | null;
    };
    preferencias_usuario: {
        id: number;
        nome: string;
        cor: string;
    }[][];
    status: number;
} | {
    status: number;
    message: string;
}>;
export declare function buscarCliente(id: number): Promise<{
    id: number;
    nome: string;
    data_nascimento: Date;
    cpf: string;
    email: string;
    senha: string;
    telefone: string;
    foto_perfil: string | null;
    link_instagram: string | null;
    id_sexo: number | null;
} | null>;
