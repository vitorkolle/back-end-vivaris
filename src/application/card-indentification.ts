export interface IVerificarDadosCartao {
    verificarNumeroCartao(numeroCartao : string) : Promise<boolean>
    verificarCvcCartao(cvc : string) : Promise<boolean>
}