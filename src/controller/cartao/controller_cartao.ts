import { ERROR_CONTENT_TYPE, ERROR_INTERNAL_SERVER, ERROR_INTERNAL_SERVER_DB, ERROR_INVALID_CARD, ERROR_INVALID_ID, ERROR_NOT_FOUND, ERROR_REQUIRED_FIELDS, SUCCESS_DELETED_ITEM } from "../../../module/config";
import { TCard } from "../../domain/entities/card-entity";
import { verificacao } from "../../infra/card-data-validations";
import { isValidCardNumber, isValidCvc, isValidId, isValidModality, isValidName } from "../../infra/zod-validations";
import { buscarCartao, buscarCartaoPorCliente, cadastrarCartao, deletarCartao } from "../../model/DAO/cartao/cartao";


export async function setCadastrarCartao(cardData:TCard, contentType:string | undefined) {
    try {
        if(String(contentType).toLowerCase() != 'application/json'){
            return ERROR_CONTENT_TYPE
        }

        function validarData(data: string): boolean {
      
            if (data.length !== 10) return false;
        
            const partes = data.split("-");
            const ano = parseInt(partes[0], 10);
            const mes = parseInt(partes[1], 10);
            const dia = parseInt(partes[2], 10);
        
     
            if (mes < 1 || mes > 12) return false;
        
       
            const dataTestada = new Date(ano, mes - 1, dia);
            return dataTestada.getFullYear() === ano && dataTestada.getMonth() === mes - 1 && dataTestada.getDate() === dia;
        }
        
        function transformarData(data: string): Date {
            if (!validarData(data)) {
                throw new Error("Formato de data inválido");
            }
        
            return new Date(data);
        }

        if(
            !cardData.numero_cartao || !isValidCardNumber(Number(cardData.numero_cartao)) ||
            !cardData.modalidade    || !isValidModality(cardData.modalidade)      ||
            !cardData.nome          || !isValidName(cardData.nome)                || 
            !cardData.validade      || !validarData(cardData.validade.toString()) ||  !transformarData(cardData.validade.toString()) ||
            !cardData.cvc           || !isValidCvc(Number(cardData.cvc))     
        )
        {
         return ERROR_REQUIRED_FIELDS   
        }

        if(!await verificacao.verificarNumeroCartao(cardData.numero_cartao) || !await verificacao.verificarCvcCartao(cardData.cvc)){
            if(verificacao.verificarCartaoExistente(cardData) !== null){
                return ERROR_INVALID_CARD
            }
        }

        const cardFinalData: TCard = {
            modalidade: cardData.modalidade,
            numero_cartao: cardData.numero_cartao,
            nome: cardData.nome,
            cvc: cardData.cvc,
            validade: transformarData(cardData.validade.toString())
        };

        let newCard = await cadastrarCartao(cardFinalData) 

        if(newCard){
            return{
                card: newCard,
                status_code: 200
            }
        }

        return{
            card: ERROR_INTERNAL_SERVER_DB,
            status_code: 500
        }
    } catch (error) {
        console.error('Erro ao tentar inserir um novo cartao:', error);
        return ERROR_INTERNAL_SERVER;
    }
}

export async function getBuscarCartao(cardId:number) {

    if(!isValidId(cardId)){
        return ERROR_INVALID_ID
    }    

    const card = await buscarCartao(cardId)

    if(card){
        return{
            card: card,
            status_code: 200
        }
    }

    return {
        card: ERROR_NOT_FOUND.message,
        status_code: ERROR_NOT_FOUND.status_code
    }
}

export async function getBuscarCartaoPorCliente(clientId:number){
    if(!isValidId(clientId)){
        return ERROR_INVALID_ID
    }

    const cards = await buscarCartaoPorCliente(clientId)

    if(cards){
        return{
            cards: cards,
            status_code: 200
        }
    }

    return {
        cards: ERROR_NOT_FOUND.message,
        status_code: ERROR_NOT_FOUND.status_code
    }
}

export async function setDeletarCartao(cardId:number) {
    try {
        if(!isValidId(cardId)){
            return ERROR_INVALID_ID
        }

        const validateId = await getBuscarCartao(cardId)

        if(validateId.status_code === 404){
            return ERROR_NOT_FOUND
        }

        let deleteId = await deletarCartao(cardId)

        if(deleteId){
            return SUCCESS_DELETED_ITEM
        }

        return ERROR_INTERNAL_SERVER_DB
    } catch (error) {
        console.error('Erro ao tentar deletar um cartao:', error);
        return ERROR_INTERNAL_SERVER;
    }
}