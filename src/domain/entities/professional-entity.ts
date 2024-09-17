export type TProfessional = {
    nome: string;
    email: string;
    cpf: string;
    data_nascimento: Date
    telefone: string;
    id_sexo: number | null
    cip: string
    senha: string
    foto_perfil?: string | null;
    link_instagram?: string | null
}