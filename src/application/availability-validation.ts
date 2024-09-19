export interface IVerificarDadosDisponibilidade {
    verificarHorario(horario:string): Promise<boolean>
    isDayOfWeek(dia:string):boolean
}