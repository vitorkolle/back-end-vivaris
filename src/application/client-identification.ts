export interface IVerificarDadosPessoais {
    verificarEmail(email:string): Promise<boolean>
    verificarCpf(cpf:string): Promise<boolean>
}