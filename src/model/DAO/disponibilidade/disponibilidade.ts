import { PrismaClient } from "@prisma/client"
import { TAvailability} from "../../../domain/entities/availability-entity"
import { ERROR_NOT_FOUND } from "../../../../module/config";
const prisma = new PrismaClient()


export async function criarDisponibilidade(disponibilidade: TAvailability) {
    try {
        let disponibilidadeExistente = await prisma.tbl_disponibilidade.findFirst({ 
          where: {
            dia_semana: disponibilidade.dia_semana,
            horario_inicio: disponibilidade.horario_inicio,
            horario_fim: disponibilidade.horario_fim,
          },
        });

        let newAvailability

        if (!disponibilidadeExistente) {
            newAvailability = await prisma.tbl_disponibilidade.create({
            data: {
              dia_semana: disponibilidade.dia_semana,
              horario_inicio: disponibilidade.horario_inicio,
              horario_fim: disponibilidade.horario_fim,
            }, 
          });
        } else {
           newAvailability = disponibilidadeExistente
        }

        return newAvailability;
    
      } catch (error) {
        console.error("Erro ao criar nova disponibilidade:", error);
        throw new Error("Não foi possível criar a dipsonibilidade.");
      }
}

export async function listarDisponibilidadesPorProfissional(profissionalId: number) {
  try {

    const usuario = await prisma.tbl_psicologos.findUnique({ 
      where: {
        id: profissionalId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
      },
    });

    if (!usuario) {
      return{
        id: false
      };
    }

    const disponibilidades = await prisma.tbl_psicologo_disponibilidade.findMany({
      where: {
        psicologo_id: profissionalId,
      },
      include: {
        tbl_disponibilidade: {
          select: {
            id: true,
            dia_semana: true,
            horario_inicio: true,
            horario_fim: true
          },
        },
      },
    });

    const response = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      disponibilidades: disponibilidades.map((disp: any | string) => ({
        id: disp.tbl_disponibilidade?.id,
        dia_semana: disp.tbl_preferencias?.d,
        hexcolor: disp.tbl_preferencias?.cor
      })),
    };

    return response;

  } catch (error) {
    console.error("Erro ao obter o usuário com as preferências:", error);
    throw new Error("Não foi possível obter o usuário com as preferências.");
  }
}

export async function criarDisponibilidadeProfissional(profissionalId: number, disponibilidade: number, status:string){

  console.log(profissionalId, disponibilidade, status);
  
  
  try {
    await prisma.tbl_psicologo_disponibilidade.create({
      data: {
        psicologo_id: profissionalId,
        disponibilidade_id: disponibilidade,
        status_disponibilidade: status,
        },
    })

    const usuario = await prisma.tbl_psicologos.findUnique({
      where: {
        id: profissionalId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        cpf: true,
        data_nascimento: true,
        foto_perfil: true,
        cip: true,
        link_instagram: true,
        tbl_sexo: {
          select: {
            id: true,
            sexo: true
          }
        }
      },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

    const disponibilidades = await prisma.tbl_psicologo_disponibilidade.findMany({
      where: {
        psicologo_id: profissionalId,
      },
      include: {
        tbl_disponibilidade: {
          select: {
            id: true,
            dia_semana: true,
            horario_inicio: true,
            horario_fim: true,
          },
        },
      },
    });

    if (!disponibilidades) {
      console.log('oi');
      
    }

    const response = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      disponibilidades: disponibilidades.map((disp: any | string) => ({
        id: disp.tbl_disponibilidade?.id,
        dia_semana: disp.tbl_disponibilidade?.dia_semana,
        from: disp.tbl_disponibilidade?.horario_inicio,
        to: disp.tbl_disponibilidade?.horario_fim,
        status: disp.status_disponibilidade,
      })),
    };

    return response;
  } catch (error) {
    console.error("Erro ao gravar disponibilidade do profissional:", error);
    throw new Error("Não foi possível gravar as disponibilidades do profissional.");
  }
}

export async function buscarDisponibilidadePsicologo(professionalId: number, availabilityId: number){
  try {
    const disponibilidadePsicologo = await prisma.tbl_psicologo_disponibilidade.findMany({
      where: {
        psicologo_id: professionalId,
        disponibilidade_id: availabilityId
      },
      select:{
        psicologo_id: true,
        disponibilidade_id: true,
        status_disponibilidade: true
      }
    })

    if(disponibilidadePsicologo){
      return disponibilidadePsicologo
    }
    else 
    return false

  } catch (error) {
    console.error("Erro ao encontrar disponibilidade de psicólogos:", error);
    throw new Error("Não foi possível achar disponibilidades");
  }
}

export async function buscarDisponibilidade(id: number){
  try {
    let availability = await prisma.tbl_disponibilidade.findMany({
      where: {
        id: id
      },
      select: {
        dia_semana: true,
        horario_inicio: true,
        horario_fim: true
      }
    })

    if(availability.length < 1){
      return false
    }

    return availability

  } catch (error) {
    console.error("Erro ao encontrar disponibilidade:", error);
    throw new Error("Não foi possível achar disponibilidades");
  }
}
