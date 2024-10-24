import { TProfessional } from "./professional-entity";
import { TUser } from "./user-entity";
export type TAppointment = {
    id: number;
    data_consulta: string;
    valor: number;
    avaliacao: number;
    cliente: TUser;
    psicologo: TProfessional;
};
