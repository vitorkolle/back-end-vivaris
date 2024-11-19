export type TAssessmentNumber = "Um" | "Dois" | "Tres" | "Quatro" | "Cinco";
export type TAssessment = {
    texto: string;
    avaliacao: TAssessmentNumber;
    id_cliente: number;
    id_psicologo: number;
};
