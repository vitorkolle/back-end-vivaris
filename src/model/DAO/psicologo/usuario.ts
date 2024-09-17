import { PrismaClient } from "@prisma/client"
import { TProfessional } from "../../../domain/entities/professional-entity";
import { ERROR_NOT_FOUND } from "../../../../module/config";

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

export async function logarPsicologo(email: string, senha: string){
  try {
    const usuario = await prisma.tbl_psicologos.findUnique({
      where: {
        email: email,
        senha: senha
      },
      select:{
        id: true,
        nome: true,
        telefone: true,
        data_nascimento: true,
        foto_perfil: true,
        cip: true,
        email: true,
        link_instagram: true,
        tbl_sexo: {
          select: {
            id: true,
            sexo: true
          }
        }
      }
    })
    if (!usuario) {
      return Promise.resolve(ERROR_NOT_FOUND);      
    }

    return usuario;
    
  } catch (error) {
    console.error("Erro ao obter o usuário", error);
    throw new Error("Não foi possível obter o usuário");
  }
}