export declare function getAllSexos(): Promise<{
    id: number;
    sexo: string | null;
}[]>;
export declare function getSexoById(sexoId: number): Promise<{
    id: number;
    sexo: string | null;
}>;
