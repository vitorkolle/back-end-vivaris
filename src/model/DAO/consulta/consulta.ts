import { PrismaClient, tbl_consultas_avaliacao } from "@prisma/client";
import { TAppointment } from "../../../domain/entities/appointment-entity";
const prisma = new PrismaClient();

export async function selectAppointment(id: number): Promise<TAppointment | false> {

    try {
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
                        }
                    }
                }
            }
        })

        if (!appointment) {
            return false
        }

        return appointment as unknown as TAppointment
    } catch (error) {
        console.error("Erro ao buscar consulta", error);
        throw new Error("Não foi possível buscar a consulta");
    }

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
        return false
    }

    function formatAvaliacao(avaliacao: number): tbl_consultas_avaliacao {
        switch (true) {
            case (avaliacao >= 1 && avaliacao < 2): return tbl_consultas_avaliacao.Um

            case (avaliacao >= 2 && avaliacao < 3): return tbl_consultas_avaliacao.Dois

            case (avaliacao >= 3 && avaliacao < 4): return tbl_consultas_avaliacao.Tres

            case (avaliacao >= 4 && avaliacao < 5): return tbl_consultas_avaliacao.Quatro

            case (avaliacao === 5): return tbl_consultas_avaliacao.Cinco

            default: return tbl_consultas_avaliacao.Um
        }

    }

    const appointment = await prisma.tbl_consultas.create({
        data: {
            valor: professional.preco,
            avaliacao: formatAvaliacao(Number(avaliacao)),
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

    const user = await prisma.tbl_clientes.findUnique({
        where: {
            id: idClient
        }
    })

    if (!user) {
        return false
    }

    const professionalUser = await prisma.tbl_psicologos.findUnique({
        where: {
            id: idProfessional
        }
    })

    if (!professionalUser) {
        return false
    }

    return {
        consulta: appointment,
        psicologo: professionalUser,
        cliente: user
    }
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

export async function updateAppointment(data: Date, id: number) {
    try {
        let appointment = await prisma.tbl_consultas.update({
            where: {
                id: id
            },
            data: {
                data_consulta: data
            }
        })

        if (!appointment) {
            return false
        }

        return true
    } catch (error) {
        console.error("Erro ao atualizar a consulta do profissional:", error);
        throw new Error("Não foi possível atualizar a consulta do profissional");
    }
}