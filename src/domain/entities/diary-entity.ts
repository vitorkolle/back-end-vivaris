import { TMood } from "./emotion-entity"

export type TDiary = {
    data_diario: string | Date
    anotacoes: string,
    id_humor: number,
    id_cliente: number
}