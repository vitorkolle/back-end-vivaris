import { TAvailability } from "./availability-entity";
export type TProfessionalWithAvailability = {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    disponibilidades: [TAvailability];
};
