export type DayOfWeek = 
  'Domingo' | 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';

export type TAvailability = {
    day: DayOfWeek;
    from: string;
    to: string;
}