export type WeekDay =
  'Domingo' | 'Segunda' | 'Terca' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sabado';

export type TAvailability = {
  id?: number;
  dia_semana: WeekDay;
  horario_inicio: string;
  horario_fim: string;
}

export type TProfessionalSchedule = {
  profissional_id: number;
  disponibilidades: number[];
}