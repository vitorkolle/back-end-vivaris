import { TCard } from "../domain/entities/card-entity";
export interface IVerificarDadosCartao {
    verificarNumeroCartao(numeroCartao: string): Promise<boolean>;
    verificarCvcCartao(cvc: string): Promise<boolean>;
    verificarCartaoExistente(cardData: TCard): Promise<TCard | null>;
}
