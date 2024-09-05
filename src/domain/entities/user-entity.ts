export type TUser = {
    nome: string;
    email: string;
    senha: string;
    telefone: bigint; 
    cpf: bigint; 
    data_nascimento: Date;
    foto_perfil?: string;
    link_instagram?: string
    sexo: number;
}