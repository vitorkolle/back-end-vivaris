import { PrismaClient } from "@prisma/client"
import { TProfessional } from "../../../domain/entities/professional-entity";
import { ERROR_NOT_FOUND } from "../../../../module/config";

const prisma = new PrismaClient()

export async function criarNovoPsicologo(userInput: TProfessional) {
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
      } 
    });

    return user

  } catch (error) {
    console.error("Erro ao criar novo profissional:", error);
    throw new Error("Não foi possível criar o profissional.");
  }
}

export async function logarPsicologo(email: string, senha: string){
  try {
    const user = await prisma.tbl_psicologos.findUnique({
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
    if (!user) {
      return Promise.resolve(ERROR_NOT_FOUND);      
    }

    return user;
    
  } catch (error) {
    console.error("Erro ao obter o usuário", error);
    throw new Error("Não foi possível obter o usuário");
  }
}

export async function buscarPsicologo(id:number) {
  try {
    const professional = await prisma.tbl_psicologos.findUnique({
      where: {
        id: id
      },
      include: {
        tbl_psicologo_disponibilidade: {
          select: {
            psicologo_id: true,
            tbl_disponibilidade: {
              select: {
                dia_semana: true,
                horario_inicio: true,
                horario_fim: true,
                id: true
              }
            }
        },
      },
    },
  })

    if(professional){
      return professional
    }
      return Promise.resolve(ERROR_NOT_FOUND)

  } catch (error) {
    console.error("Erro ao obter o usuário", error);
    throw new Error("Não foi possível obter o usuário");
  }
}
