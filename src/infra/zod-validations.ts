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

    console.log(testName);
    

    return testName.success
}

export function isValidPassword(password: string) : boolean{
    const passwordSchema = z.string().min(8).max(20)

    const testPassword = passwordSchema.safeParse(password)

    return testPassword.success
}

export function isValidWeekDay(date: string) : boolean{

    //? Verificar se o tipo 'date' do zod corresponde ao tipo de data que estamos utilizando
    //* ^  Possível uso quando a aplicação estiver na fase final
    const dateSchema = z.string().min(5).max(7)

    const testDate = dateSchema.safeParse(date)

    if(testDate.success === false){
        return false
    }

    const weekDaysArray = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'] as const;

    const weekDaySchema = z.enum(weekDaysArray)

    const finalDayTest = weekDaySchema.safeParse(date)

    

    return finalDayTest.success
}

export function isValidHour(hour: string) : boolean{
    const hourSchema = z.string().time()

    const validateHour = hourSchema.safeParse(hour)  
    

    return validateHour.success
}
