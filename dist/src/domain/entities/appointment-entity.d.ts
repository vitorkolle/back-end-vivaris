import { TProfessional } from "./professional-entity";
import { TUser } from "./user-entity";
export type TAppointment = {
    id: number;
    data_consulta: Date;
    valor: number;
    avaliacao: string;
    cliente: TUser;
    psicologo: TProfessional;
};
