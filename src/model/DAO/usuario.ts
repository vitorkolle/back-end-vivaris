import { PrismaClient } from "@prisma/client"
import { TUser } from "../../domain/entities/user-entity";
const prisma = new PrismaClient()
 
export async function criarNovoCliente(userInput: TUser) {
    try {
      const user = await prisma.tbl_clientes.create({
        data: {
          nome: userInput.nome,
          email: userInput.email,
          senha: userInput.senha,
          telefone: userInput.telefone,
          cpf: userInput.cpf,
          data_nascimento: userInput.data_nascimento,
          foto_perfil: userInput.foto_perfil,
          link_instagram: userInput.link_instagram,
          id_sexo: userInput.sexo,
        },
      });

      console.log(user);

      return user;
      
    } catch (error) {
      console.error("Erro ao criar novo cliente:", error);
      throw new Error("Não foi possível criar o cliente.");
    }
  }