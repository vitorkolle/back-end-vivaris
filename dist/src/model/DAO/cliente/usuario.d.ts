import { TUser } from "../../../domain/entities/user-entity";
export declare function criarNovoCliente(userInput: TUser): Promise<TUser>;
export declare function obterUsuarioComPreferencias(userId: number): Promise<{
    id: any;
    nome: any;
    email: any;
    telefone: any;
    preferencias: any;
}>;
export declare function criarPreferenciasUsuario(userId: number, preference: number): Promise<{
    id: any;
    nome: any;
    email: any;
    telefone: any;
    preferencias: any;
}>;
export declare function logarCliente(email: string, senha: string): Promise<{
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
}>;
export declare function buscarCliente(id: number): Promise<any>;
