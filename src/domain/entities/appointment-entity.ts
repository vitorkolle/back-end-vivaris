import { TProfessional } from "./professional-entity"
import { TUser } from "./user-entity"

export type TAppointment ={
    id:number,
    data_consulta: string,
    valor: number,
    avaliacao:string
    tbl_clientes_: TUser,
    tbl_psicologos: TProfessional
}