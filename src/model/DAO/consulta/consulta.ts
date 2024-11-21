import { PrismaClient, tbl_avaliacoes, tbl_avaliacoes_avaliacao } from "@prisma/client";
const prisma = new PrismaClient();

export async function selectAppointment(id: number) {
    const appointment = await prisma.tbl_consultas.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            data_consulta: true,
            valor: true,
            avaliacao: true,
            tbl_clientes: {
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    telefone: true,
                    cpf: true,
                    data_nascimento: true,
                    foto_perfil: true,
                    link_instagram: true,
                    tbl_sexo: {
                        select: {
                            id: true,
                            sexo: true,
                        },
                    },
                    tbl_clientes_preferencias: {
                        select: {
                            id_clientes: true,
                            id_preferencias: true,
                            tbl_preferencias: {
                                select: {
                                    id: true,
                                    nome: true,
                                    cor: true,
                                }
                            },
                        },
                    },
                }
            },
            tbl_psicologos: {
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    telefone: true,
                    cpf: true,
                    cip: true,
                    data_nascimento: true,
                    foto_perfil: true,
                    link_instagram: true,
                    tbl_sexo: {
                        select: {
                            id: true,
                            sexo: true,
                        },
                    },
                },
            },
        }
    })


    if (!appointment) {
        throw new Error('Consulta não encontrada.')
    }
    return appointment
}

export async function createAppointment(idProfessional: number, idClient: number, data: Date) {
    const professional = await prisma.tbl_psicologos.findUnique({
        where: {
            id: idProfessional
        }
    })

    if (!professional) {
       return false
    }

    let avaliacao = await prisma.$queryRawUnsafe(`call getMediaAvaliacao(${idProfessional})`)

    if (!avaliacao) {
        avaliacao = 0
    }

    const appointment = await prisma.tbl_consultas.create({
    data: {
        valor: professional.preco,
        avaliacao: avaliacao as tbl_avaliacoes_avaliacao,
        tbl_clientes: {
            connect: {
                id: idClient
            }
        },
        tbl_psicologos: {
            connect: {
                id: idProfessional
            }
        },
        data_consulta: data
    }
})

if (!appointment) {
    return false
}

return appointment
}

export async function deleteAppointment(id: number) {
    try {
        let appointment = await prisma.tbl_consultas.delete({
            where: {
                id: id
            }
        })

        if (!appointment) {
            return false
        }

        return true
    } catch (error) {
    console.error("Erro ao deletar consulta do profissional:", error);
    throw new Error("Não foi possível deletar a consulta do profissional");
    }
}