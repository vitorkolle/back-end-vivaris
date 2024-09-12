import { PrismaClient } from "@prisma/client"
import { TProfessional } from "../../../domain/entities/professional-entity";
const prisma = new PrismaClient()

export async function criarNovoPsicologo(userInput: TProfessional): Promise<TProfessional> {
  try {

    const user = await prisma.tbl_psicologos.create({
      data: {
        nome: userInput.nome,
        email: userInput.email,
        senha: userInput.senha,
        telefone: userInput.telefone,
        cpf: userInput.cpf,
        data_nascimento: userInput.data_nascimento,
        cip : userInput.cip,
        id_sexo: userInput.id_sexo
      }, 
    });

    return user;

  } catch (error) {
    console.error("Erro ao criar novo profissional:", error);
    throw new Error("Não foi possível criar o profissional.");
  }
}