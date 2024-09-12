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
