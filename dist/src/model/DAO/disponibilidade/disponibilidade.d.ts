import { WeekDay, TAvailability } from "../../../domain/entities/availability-entity";
import { TProfessionalAvailability } from "../../../domain/entities/professional-availability";
export declare function criarDisponibilidade(disponibilidade: TAvailability): Promise<{
    id: number;
    dia_semana: import(".prisma/client").$Enums.tbl_disponibilidade_dia_semana;
    horario_inicio: string;
    horario_fim: string;
}>;
export declare function listarDisponibilidadesPorProfissional(profissionalId: number): Promise<{
    id: null;
    nome: null;
    email: null;
    telefone: null;
    disponibilidades: string;
    message: string;
} | {
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
}>;
export declare function criarDisponibilidadeProfissional(profissionalId: number, disponibilidade: number, status: string): Promise<{
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
}>;
export declare function buscarDisponibilidadePsicologo(availabilityData: TProfessionalAvailability): Promise<false | {
    psicologo_id: number;
    disponibilidade_id: number;
    status_disponibilidade: string;
}[]>;
export declare function buscarDisponibilidade(id: number): Promise<false | {
    dia_semana: import(".prisma/client").$Enums.tbl_disponibilidade_dia_semana;
    horario_inicio: string;
    horario_fim: string;
}[]>;
export declare function deletarDisponibilidade(diaSemana: string, idPsicologo: number): Promise<boolean>;
export declare function atualizarDisponibilidade(availabilityData: TAvailability, availabilityId: number): Promise<false | {
    id: number;
    dia_semana: import(".prisma/client").$Enums.tbl_disponibilidade_dia_semana;
    horario_inicio: string;
    horario_fim: string;
}>;
export declare function atualizarDisponibilidadeProfissional(availabilityData: any, idPsico: number): Promise<boolean>;
export declare function buscarDisponibilidadePsicologoById(availabilityId: number): Promise<{
    status_code: number;
    message: string;
    data?: undefined;
} | {
    data: {
        psicologo_id: number;
        disponibilidade_id: number;
        status_disponibilidade: string;
    };
    status_code: number;
    message?: undefined;
}>;
export declare function deletarDisponibilidadeByHour(id_psicologo: number, dia_semana: WeekDay, horario_inicio: string): Promise<boolean>;
export declare function buscarDisponibilidadeByHourAndWeekDay(dia_semana: WeekDay, horario_inicio: string, id_psicologo: number): Promise<boolean>;
