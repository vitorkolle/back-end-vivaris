import { TAvailability } from "../../../domain/entities/availability-entity";
import { TProfessionalAvailability } from "../../../domain/entities/professional-availability";
export declare function criarDisponibilidade(disponibilidade: TAvailability): Promise<{
    id: number;
    dia_semana: import(".prisma/client").$Enums.tbl_disponibilidade_dia_semana;
    horario_inicio: Date;
    horario_fim: Date;
}>;
export declare function listarDisponibilidadesPorProfissional(profissionalId: number): Promise<{
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
} | {
    id: boolean;
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
    horario_inicio: Date;
    horario_fim: Date;
}[]>;
export declare function deletarDisponibilidade(diaSemana: string, idPsicologo: number): Promise<boolean>;
export declare function atualizarDisponibilidade(availabilityData: TAvailability, availabilityId: number): Promise<false | {
    id: number;
    dia_semana: import(".prisma/client").$Enums.tbl_disponibilidade_dia_semana;
    horario_inicio: Date;
    horario_fim: Date;
}>;
export declare function atualizarDisponibilidadeProfissional(availabilityData: TProfessionalAvailability): Promise<false | {
    id: number;
    psicologo_id: number;
    disponibilidade_id: number;
    status_disponibilidade: string;
}>;
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
} | undefined>;
