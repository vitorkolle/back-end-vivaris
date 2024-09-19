export type DayOfWeek = 
  'Domingo' | 'Segunda' | 'Terca' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sabado';

export type TAvailability = {
    dia_semana: DayOfWeek;
    horario_inicio: Date;
    horario_fim: Date;
}

export type TProfessionalSchedule = {
  profissional_id: number;
  disponibilidades: number[];
}