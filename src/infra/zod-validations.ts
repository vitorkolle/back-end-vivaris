/** 
 * Os comentários estão sendo criados com a extensão betterComents para melhorar a legibilidade
 */

import { z } from "zod";

export function isValidId(id:number) : boolean {
    
    const idSchema = z.number().int().positive()

    const testId = idSchema.safeParse(id)

    return testId.success
}

export function isValidEmail(email:string) : boolean{
 // TODO: Quando a aplicação estiver na fase final, trocar o .max(256) por .email()
 
  const emailSchema = z.string().max(256)
  
  const testEmail = emailSchema.safeParse(email)

  return testEmail.success
}

export function isValidName(name:string) : boolean{
    const nameSchema = z.string().max(50).refine((name) => /^[A-Za-zÀ-ÖØ-ÿ ]+$/.test(name))

    const testName = nameSchema.safeParse(name)
    

    return testName.success
}

export function isValidPassword(password: string) : boolean{
    const passwordSchema = z.string().min(8).max(20)

    const testPassword = passwordSchema.safeParse(password)
    

    return testPassword.success
}

export function isValidWeekDay(date: string) : boolean{

    const weekDaySchema = z.enum(['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'])

    const finalDayTest = weekDaySchema.safeParse(date)

    return finalDayTest.success
}

export function isValidHour(hour: string) : boolean{
    const hourSchema = z.string().time().length(8)

    const validateHour = hourSchema.safeParse(hour)  
    
    return validateHour.success
}


export function isValidNumberArray(numberArray : Array<number>) : boolean{
    const numberArraySchema = z.array(z.number().int().positive()).min(1)

    const testNumberArray = numberArraySchema.safeParse(numberArray)

    return testNumberArray.success
}


export function isValidAvailbilityStatus(availabilityStatus : string) : boolean{

   const availabilityStatusArraySchema = z.enum(['Livre', 'Selecionado', 'Pago', 'Concluido'])

   const finalStatusTest = availabilityStatusArraySchema.safeParse(availabilityStatus)

   return finalStatusTest.success
}

export function isValidCardNumber(cardNumber: string){
    const cardNumberSchema = z.string().length(16)

    const testNumber = cardNumberSchema.safeParse(cardNumber)

    return testNumber.success
}

export function isValidModality(modality:string){

    const modalitySchema = z.enum(['Credito', 'Debito'])

    const testModality = modalitySchema.safeParse(modality)

    return testModality.success
}

export function isValidCvc(cvc: string){
    const cvcSchema = z.number().int().positive().min(3)

    const testCvc = cvcSchema.safeParse(cvc)

    return testCvc.success
}