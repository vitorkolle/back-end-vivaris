export type TModalidade = 'Credito' | 'Debito';
export type TCard = {
    modalidade: TModalidade;
    nome: string;
    numero_cartao: string;
    cvc: string;
    validade: Date;
};
