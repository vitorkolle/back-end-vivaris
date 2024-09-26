export interface IVerificarPreferencias {
    isValid(id_preference: number) : Promise<boolean>
    alreadyExists(id_preference:number, id_cliente:number ): Promise<boolean> 
};
//
