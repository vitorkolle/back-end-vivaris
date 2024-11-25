import { PrismaClient } from "@prisma/client";
import { WeekDay, TAvailability } from "../../../domain/entities/availability-entity";
import { ERROR_NOT_FOUND_AVAILBILITY, ERROR_NOT_FOUND_PROFESSIONAL } from "../../../../module/config";
import { TProfessionalAvailability } from "../../../domain/entities/professional-availability";
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
      const response = {
        id: null,
        nome: null,
        email: null,
        telefone: null,
        disponibilidades: ERROR_NOT_FOUND_AVAILBILITY.message,
        message: ERROR_NOT_FOUND_PROFESSIONAL.message
      };
      return response;
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
    
    if(disponibilidades.length < 1){
      const response = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        disponibilidades: ERROR_NOT_FOUND_AVAILBILITY.message
      };

      return response;
    }

    else{
      const response = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        disponibilidades: disponibilidades.map((disp: any | string) => ({
          id: disp.tbl_disponibilidade.id,
          dia_semana: disp.tbl_disponibilidade.dia_semana,
          horario_inicio: disp.tbl_disponibilidade.horario_inicio,
          horario_fim: disp.tbl_disponibilidade.horario_fim
        })),
      };

      return response;
    }

  } catch (error) {
    console.error("Erro ao obter disponibilidade", error);
    throw new Error("Não foi possível obter o psicólogo com as disponibilidades.");
  }
}

export async function criarDisponibilidadeProfissional(profissionalId: number, disponibilidade: number, status:string){  
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
        },
        preco:true
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
      throw new Error('Nenhuma disponibilidade encontrada.');
    }

    const response = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      disponibilidades: disponibilidades.map((disp: any | string) => ({
        id: disp.tbl_disponibilidade.id,
        dia_semana: disp.tbl_disponibilidade.dia_semana,
        from: disp.tbl_disponibilidade.horario_inicio,
        to: disp.tbl_disponibilidade.horario_fim,
        status: disp.status_disponibilidade,
      })),
    };

    return response;
  } catch (error) {
    console.error("Erro ao gravar disponibilidade do profissional:", error);
    throw new Error("Não foi possível gravar as disponibilidades do profissional.");
  }
}

export async function buscarDisponibilidadePsicologo(availabilityData: TProfessionalAvailability){
  try {
    const disponibilidadePsicologo = await prisma.tbl_psicologo_disponibilidade.findMany({
      where: {
        psicologo_id: availabilityData.id_psicologo,
        disponibilidade_id: availabilityData.disponibilidade_id
      },
      select:{
        psicologo_id: true,
        disponibilidade_id: true,
        status_disponibilidade: true
      }
    })

    if(disponibilidadePsicologo.length > 0){
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

export async function deletarDisponibilidade(diaSemana:string, idPsicologo: number) {
  try {
    let sql = `CALL deleteDisp("${diaSemana}", ${idPsicologo})`
    let user = await prisma.$queryRawUnsafe(sql)
    
    if(!user){
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao deletar disponibilidade:", error);
    throw new Error("Não foi possível deletar a disponibilidade");
  }
}

export async function atualizarDisponibilidade(availabilityData: TAvailability, availabilityId: number) {
  try {
    const updateAvaibility = await prisma.tbl_disponibilidade.update({
      where: {
        id: availabilityId
      },
      data:{
        dia_semana: availabilityData.dia_semana,
        horario_inicio: availabilityData.horario_inicio,
        horario_fim: availabilityData.horario_fim
      }
    }) 

    if(!updateAvaibility){
      return false
    }

    return updateAvaibility

  } catch (error) {
    console.error("Erro ao atualizar disponibilidade:", error);
    throw new Error("Não foi possível atualizar a disponibilidade");
  }  
}

export async function atualizarDisponibilidadeProfissional(availabilityData: TProfessionalAvailability) {
  try {
    const updateProfessionalAvailbility = await prisma.tbl_psicologo_disponibilidade.update({
      where: {
        id: availabilityData.disponibilidade_id
      },
      data:{
        status_disponibilidade: availabilityData.status
      }
    }) 

    if(!updateProfessionalAvailbility){
      return false
    }

    return updateProfessionalAvailbility
    
  } catch (error) {
    console.error("Erro ao atualizar disponibilidade do profissional:", error);
    throw new Error("Não foi possível atualizar a disponibilidade do profissional");
  }
}

export async function buscarDisponibilidadePsicologoById(availabilityId:number) {
  try {
    const searchProfessionalAvailbility = await prisma.tbl_psicologo_disponibilidade.findUnique({
      where:{
        id: availabilityId
      },
      select: {
        disponibilidade_id: true,
        psicologo_id: true,
        status_disponibilidade: true
      }
    })

    if(!searchProfessionalAvailbility){
      return{
        status_code: 404,
        message: 'Disponibilidade não encontrada'
      }
    }

    return{
      data: searchProfessionalAvailbility,
      status_code: 200
    }
  } catch (error) {
    console.error("Erro ao obter disponibilidade do profissional:", error);
    throw new Error("Não foi possível obter a disponibilidade do profissional");
  }
}

export async function deletarDisponibilidadeByHour(id_psicologo: number, dia_semana: WeekDay, horario_inicio: string){
  try {
    let sql = `CALL deleteDispByWeekDayAndHour("${dia_semana}", '${horario_inicio}', ${id_psicologo})`
    let availability = await prisma.$queryRawUnsafe(sql)    

    if (!availability) {
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao deletar disponibilidade do profissional:", error);
    throw new Error("Não foi possível deletar a disponibilidade do profissional");
  }
}

export async function buscarDisponibilidadeByHourAndWeekDay(dia_semana : WeekDay, horario_inicio : string, id_psicologo : number) {
  try {
    let availability = await prisma.tbl_psicologo_disponibilidade.findMany({
      where:{
        psicologo_id: id_psicologo
      },
      select: {
        tbl_disponibilidade:{
          select: {
            dia_semana: true,
            horario_inicio: true
          }
        }
      }
    })
   
    if(availability.length < 1){
      return false
    }
    let existsAvailbility : boolean = false || true

    availability.forEach(avail => {      
      if(avail.tbl_disponibilidade.dia_semana === dia_semana && new Date(avail.tbl_disponibilidade.horario_inicio) === new Date(horario_inicio)){
        existsAvailbility = true
      }
    });

    return existsAvailbility === true
  } catch (error) {
    console.error("Erro ao obter disponibilidade do profissional:", error);
    throw new Error("Não foi possível obter a disponibilidade do profissional");
  }
}
