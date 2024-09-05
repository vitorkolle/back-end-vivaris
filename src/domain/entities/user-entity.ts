export type TUser = {
    nome: string;
    email: string;
    senha: string;
    telefone: string; 
    cpf: string; 
    data_nascimento: Date;
    foto_perfil?: string | null;
    link_instagram?: string | null
    id_sexo: number;
}