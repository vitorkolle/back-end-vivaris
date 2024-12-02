export type TMood = "Muito_triste" | "Triste" | "Neutro" | "Feliz" | "Muito_feliz"

export type TEmotion = {
    emocao: TMood,
    data: string | Date,
    id_cliente: number
};