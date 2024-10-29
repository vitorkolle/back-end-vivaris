import { TUserPreferences } from "../../domain/entities/user-preferences";
export declare function setInserirPreferencias(userData: TUserPreferences, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        id: any;
        nome: any;
        email: any;
        telefone: any;
        preferencias: any;
    };
    status_code: number;
    message: string;
}>;
export declare function getListarPreferencias(): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: any;
    status_code: number;
}>;
export declare function getBuscarPreferencia(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: any;
    status_code: number;
}>;
