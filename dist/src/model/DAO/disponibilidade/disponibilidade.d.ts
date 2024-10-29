import { TAvailability } from "../../../domain/entities/availability-entity";
import { TProfessionalAvailability } from "../../../domain/entities/professional-availability";
export declare function criarDisponibilidade(disponibilidade: TAvailability): Promise<any>;
export declare function listarDisponibilidadesPorProfissional(profissionalId: number): Promise<{
    id: any;
    nome: any;
    email: any;
    telefone: any;
    disponibilidades: any;
} | {
    id: boolean;
}>;
export declare function criarDisponibilidadeProfissional(profissionalId: number, disponibilidade: number, status: string): Promise<{
    id: any;
    nome: any;
    email: any;
    telefone: any;
    disponibilidades: any;
}>;
export declare function buscarDisponibilidadePsicologo(availabilityData: TProfessionalAvailability): Promise<any>;
export declare function buscarDisponibilidade(id: number): Promise<any>;
export declare function deletarDisponibilidade(diaSemana: string, idPsicologo: number): Promise<boolean>;
export declare function atualizarDisponibilidade(availabilityData: TAvailability, availabilityId: number): Promise<any>;
export declare function atualizarDisponibilidadeProfissional(availabilityData: TProfessionalAvailability): Promise<any>;
export declare function buscarDisponibilidadePsicologoById(availabilityId: number): Promise<{
    status_code: number;
    message: string;
    data?: undefined;
} | {
    data: any;
    status_code: number;
    message?: undefined;
} | undefined>;
