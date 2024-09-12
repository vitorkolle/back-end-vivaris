export interface IVerificarDadosProfissionais {
    verificarCip(cip:string): Promise<boolean>
    verificarEmail(email:string): Promise<boolean>
    verificarCpf(cpf:string): Promise<boolean>
}