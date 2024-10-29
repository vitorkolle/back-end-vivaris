import { TUserPreferences } from "../../domain/entities/user-preferences";
export declare function setInserirPreferencias(userData: TUserPreferences, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        id: number;
        nome: string;
        email: string;
        telefone: string;
        preferencias: {
            id: any;
            nome: any;
            cor: any;
        }[];
    };
    status_code: number;
    message: string;
}>;
export declare function getListarPreferencias(): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        id: number;
        nome: string;
        cor: string;
    }[];
    status_code: number;
}>;
export declare function getBuscarPreferencia(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        id: number;
        nome: string;
        cor: string;
    };
    status_code: number;
}>;
