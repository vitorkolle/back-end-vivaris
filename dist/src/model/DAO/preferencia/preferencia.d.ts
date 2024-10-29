export declare function listarPreferencias(): Promise<{
    id: number;
    nome: string;
    cor: string;
}[]>;
export declare function buscarPreferencia(id: number): Promise<{
    id: number;
    nome: string;
    cor: string;
} | null>;
