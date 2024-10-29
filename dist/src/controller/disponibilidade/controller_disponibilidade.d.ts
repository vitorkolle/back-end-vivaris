import { TAvailability } from "../../domain/entities/availability-entity";
import { TProfessionalAvailability } from "../../domain/entities/professional-availability";
export declare function transformarHorario(horario: string): Date;
export declare function setInserirDisponibilidade(disponibilidade: TAvailability, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: any;
    status_code: number;
    message: string;
}>;
export declare function criarDisponibilidadePsicologo(availability: TProfessionalAvailability): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        id: any;
        nome: any;
        email: any;
        telefone: any;
        disponibilidades: any;
    };
    status_code: number;
    message: string;
} | {
    data: {
        data: never;
        status_code: number;
        message: string;
    };
    status_code?: undefined;
    message?: undefined;
}>;
export declare function getBuscarDisponibilidade(id: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    status_code: number;
    data: any;
}>;
export declare function getListarDisponibilidadesProfissional(idProfessional: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        id: any;
        nome: any;
        email: any;
        telefone: any;
        disponibilidades: any;
    } | {
        id: boolean;
    };
    status_code: number;
} | {
    data: string;
    status_code: number;
}>;
export declare function setDeletarDisponibilidade(diaSemana: string, idPsicologo: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
}>;
export declare function setAtualizarDisponibilidade(availabilityData: TAvailability, contentType: string | undefined, availabilityId: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    status_code: number;
    message: string;
    data?: undefined;
} | {
    status_code: number;
    data: any;
    message?: undefined;
}>;
export declare function setAtualizarDisponibilidadeProfissional(availabilityData: TProfessionalAvailability, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    status_code: number;
    message: string;
    data?: undefined;
} | {
    data: any;
    status_code: number;
    message?: undefined;
}>;
