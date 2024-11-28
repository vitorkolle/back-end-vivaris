import { TAvailability, WeekDay } from "../../domain/entities/availability-entity";
import { TProfessionalAvailability } from "../../domain/entities/professional-availability";
export declare function transformarHorario(horario: string): Date;
export declare function setInserirDisponibilidade(disponibilidade: TAvailability, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        id: number;
        dia_semana: import(".prisma/client").$Enums.tbl_disponibilidade_dia_semana;
        horario_inicio: string;
        horario_fim: string;
    };
    status_code: number;
    message: string;
}>;
export declare function criarDisponibilidadePsicologo(availability: TProfessionalAvailability): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        id: number;
        nome: string;
        email: string;
        telefone: string;
        disponibilidades: {
            id: any;
            dia_semana: any;
            from: any;
            to: any;
            status: any;
        }[];
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
    data: {
        status: boolean;
        status_code: number;
        message: string;
    };
} | {
    status_code: number;
    data: {
        dia_semana: import(".prisma/client").$Enums.tbl_disponibilidade_dia_semana;
        horario_inicio: string;
        horario_fim: string;
    }[];
}>;
export declare function getListarDisponibilidadesProfissional(idProfessional: number): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: {
        id: number;
        nome: string;
        email: string;
        telefone: string;
        disponibilidades: string;
    } | {
        id: number;
        nome: string;
        email: string;
        telefone: string;
        disponibilidades: {
            id: any;
            dia_semana: any;
            horario_inicio: any;
            horario_fim: any;
        }[];
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
    data: {
        id: number;
        dia_semana: import(".prisma/client").$Enums.tbl_disponibilidade_dia_semana;
        horario_inicio: string;
        horario_fim: string;
    };
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
    data: true;
    status_code: number;
    message?: undefined;
}>;
export declare function setDeletarDisponibilidadeByHour(dia_semana: WeekDay, horario_inicio: string, id_psicologo: number, contentType: string | undefined): Promise<{
    status: boolean;
    status_code: number;
    message: string;
} | {
    data: string;
    status_code: number;
}>;
