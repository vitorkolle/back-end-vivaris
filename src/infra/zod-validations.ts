import { z } from "zod";

export function isValidId(id:number) : boolean {
    const rightId = z.number().int().positive()

    const testId = rightId.safeParse(id)

    return testId.success
}

export function isValidEmail(email:string) : boolean{
 /**
 *  TODO: Quando a aplicação estiver na fase final, trocar o .max(256) por .email()
 */
  const rightEmail = z.string().max(256)
  
  const testEmail = rightEmail.safeParse(email)

  return testEmail.success
}

export function isValidName(name:string) : boolean{
    const rightName = z.string().max(50).refine((name) => /\d/.test(name))

    const testName = rightName.safeParse(name)

    return testName.success
}

export function isValidPassword(password: string) : boolean{
    const rightPassword = z.string().min(8).max(20)

    const testPassword = rightPassword.safeParse(password)

    return testPassword.success
}
