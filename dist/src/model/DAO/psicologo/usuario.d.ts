import { TProfessional } from "../../../domain/entities/professional-entity";
export declare function criarNovoPsicologo(userInput: TProfessional): Promise<any>;
export declare function logarPsicologo(email: string, senha: string): Promise<any>;
export declare function buscarPsicologo(id: number): Promise<{
    professional: any;
    status_code: number;
}>;
