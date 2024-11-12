import { PrismaClient } from "@prisma/client"
import { TUser } from "../../../domain/entities/user-entity";
import { ERROR_NOT_FOUND, ERROR_NOT_FOUND_PREFERENCE } from "../../../../module/config";
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
        id_sexo: userInput.id_sexo
      },
    });

    return user;

  } catch (error) {
    console.error("Erro ao criar novo cliente:", error);
    throw new Error("Não foi possível criar o cliente.");
  }
}

export async function obterUsuarioComPreferencias(userId: number) {
  try {

    const usuario = await prisma.tbl_clientes.findUnique({ 
      where: {
        id: userId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
      },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

     const preferencias = await prisma.tbl_clientes_preferencias.findMany({
       where: {
         id_clientes: userId, 
       }, 
       include: {
        tbl_preferencias:{
           select: {
             id: true,
             nome: true,
             cor: true,
           },
         },
        }
     });

    const response = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      preferencias: preferencias.map((pref: any | string) => ({
         id: pref.tbl_preferencias?.id,
         nome: pref.tbl_preferencias?.nome,
        hexcolor: pref.tbl_preferencias?.cor
      })),
    };

    return response;
  } catch (error) {
    console.error("Erro ao obter o usuário com as preferências:", error);
    throw new Error("Não foi possível obter o usuário com as preferências.");
  }
}


export async function criarPreferenciasUsuario(userId: number, preference: number) {
  try {

    await prisma.tbl_clientes_preferencias.create({
      data: {
        id_clientes: userId,
        id_preferencias: preference,
      },
    });

    const usuario = await prisma.tbl_clientes.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
      },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }

    // ! Sempre que o problema for a realação do tbl_clientes_preferencias com tbl_preferencias, fazer a relação manualmente e usar o prisma format. Após isso, reiniciar o vscode.
    const preferencias = await prisma.tbl_clientes_preferencias.findMany({
      where: {
        id_clientes: userId,
      },
      include: {
        tbl_preferencias: {
          select: { 
            id: true,
            nome: true,
            cor: true
          },
        },
      },
    });

    const response = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      preferencias: preferencias.map((pref: any | string) => ({
        id: pref.tbl_preferencias?.id,
        nome: pref.tbl_preferencias?.nome,
        cor: pref.tbl_preferencias?.cor
      })),
    };

    return response;
  } catch (error) {
    console.error("Erro ao gravar preferências do cliente:", error);
    throw new Error("Não foi possível gravar as preferências do cliente.");
  }

}

export async function logarCliente(email: string, senha: string) {
  try {
    const usuario = await prisma.tbl_clientes.findUnique({
      where: {
        email: email,
        senha: senha
      },
      select:{
        id: true,
        nome: true,
        telefone: true,
        data_nascimento: true,
        foto_perfil: true
      }
    })

    console.log(usuario);
    
    if (!usuario) {
      return {
        status: ERROR_NOT_FOUND.status_code,
        message: ERROR_NOT_FOUND.message
      }    
    }

    const preferencias_usuario = await prisma.tbl_clientes_preferencias.findMany({
      where: {
        id_clientes: usuario.id
      },
      select: {
        id_preferencias: true,
        id_clientes: true
      }
    })

    if(!preferencias_usuario){
      const response = {
        usuario: usuario,
        status: 200,
        message: ERROR_NOT_FOUND_PREFERENCE.message
      }

      return response
    }

    const preferenciasArray = []

    for (let index = 0; index < preferencias_usuario.length; index++) {
      const array = preferencias_usuario[index];

      const preferencias = await prisma.tbl_preferencias.findMany({
        where: {
          id: Number(array.id_preferencias),
        },
        select: {
          id: true,
          nome: true,
          cor: true
        }
      })

      preferenciasArray.push(preferencias)
    }

    if(preferenciasArray.length < 1){
      const response = {
        usuario: usuario,
        status: 200,
        message: ERROR_NOT_FOUND_PREFERENCE.message
      }

      return response
    }

    const response = {
      usuario: usuario,
      preferencias_usuario: preferenciasArray,
      status: 200
    }

    return response

    
  } catch (error) {
    console.error("Erro ao obter o usuário", error);
    throw new Error("Não foi possível obter o usuário");
  }
}

export async function buscarCliente(id:number) {
  try {
    let clientData = await prisma.tbl_clientes.findUnique({
      select:{
        id: true,
        nome: true,
        email: true,
        senha: true,
        telefone: true,
        cpf: true,
        data_nascimento: true,
        foto_perfil: true,
        link_instagram: true,
        id_sexo: true
    },
    where: {
      id: id
    }
    })
    return clientData

  } catch (error) {
    console.error("Erro ao obter o usuário", error);
    throw new Error("Não foi possível obter o usuário");
  }
}
