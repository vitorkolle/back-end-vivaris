export interface IVerificarDadosProfissionais {
    verificarCip(cip:string): Promise<boolean>
}