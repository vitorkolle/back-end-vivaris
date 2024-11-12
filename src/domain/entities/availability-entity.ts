export type WeekDay = 
  'Domingo' | 'Segunda' | 'Terca' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sabado';

export type TAvailability = {
    dia_semana: WeekDay;
    horario_inicio: Date;
    horario_fim: Date;
}

export type TProfessionalSchedule = {
  profissional_id: number;
  disponibilidades: number[];
}