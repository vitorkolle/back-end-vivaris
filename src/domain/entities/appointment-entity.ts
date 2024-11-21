import { TProfessional } from "./professional-entity"
import { TUser } from "./user-entity"

export type TAppointment ={
    id:number,
    data_consulta: string,
    valor: number,
    avaliacao:number
    tbl_clientes: TUser,
    tbl_psicologos: TProfessional,
}