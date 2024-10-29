import { TProfessional } from "../../domain/entities/professional-entity";
export declare function setInserirPsicologo(user: TProfessional, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    user: any;
    status_code: number;
    message: string;
}>;
export declare function getLogarPsicologo(email: string | null, senha: string | null): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: any;
    status_code: number;
}>;
export declare function getBuscarPsicologo(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        professional: any;
        status_code: number;
    };
    status_code: number;
    status: boolean;
} | {
    data: string;
    status_code: number;
    status: boolean;
}>;
