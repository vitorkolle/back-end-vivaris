export interface IVerificarPreferencias {
    isValid(id_preference: number) : Promise<boolean>
    alreadyExists(id_cliente:number): Promise<boolean>
};
//
