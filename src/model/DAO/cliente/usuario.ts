import { PrismaClient } from "@prisma/client"
import { TUser } from "../../../domain/entities/user-entity";
const prisma = new PrismaClient()
 
export async function criarNovoCliente(userInput: TUser): Promise<TUser> {
    try {

      const user = await prisma.tbl_clientes.create({
        data: {
          nome: userInput.nome,
          email: userInput.email,
          senha: userInput.senha,
          telefone: userInput.telefone,
          cpf: userInput.cpf,
          data_nascimento: userInput.data_nascimento,
          id_sexo: userInput.id_sexo,
        },
      });
 
      console.log(user)
      console.log("oi");
      

      return user;
      
    } catch (error) {
      console.error("Erro ao criar novo cliente:", error);
      throw new Error("Não foi possível criar o cliente.");
  }
}

// export async function criarPreferenciasUsuario(userId: number, preferences: number[]):Promise<void>{
//   try{
//     const userPreferences: number[]

//     preferences.map((preference => {
//       const result = await prisma.tbl_clientes_preferencias.create({
//         data: {
//           id_cliente: userId,
//           id_preferencia: preference,
//         },
//       });

//       userPreferences.push(result)
//       console.log(userPreferences);
      
//     }))
//     return userPreferences
//   } catch (error){
//     console.error("Erro ao gravar preferências do cliente:", error);
//     throw new Error("Não foi possível gravar as preferências do cliente.");
//   }
// }