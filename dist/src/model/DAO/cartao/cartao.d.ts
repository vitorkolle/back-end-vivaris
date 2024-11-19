import { TCard } from "../../../domain/entities/card-entity";
export declare function cadastrarCartao(cardData: TCard): Promise<any>;
export declare function buscarCartao(cardId: number): Promise<any>;
export declare function deletarCartao(cardId: number): Promise<boolean>;
export declare function buscarCartaoPorCliente(cardId: number): Promise<any>;
