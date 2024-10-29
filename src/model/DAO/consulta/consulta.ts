const { PrismaClient } = require("@prisma/client");
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
                    tbl_cliente_preferencia: {
                        select: {
                            tbl_preferencia: {
                                id: true,
                                nome: true,
                                cor: true
                            },
                        },
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
            }
        }
    })


    if (!appointment) {
        throw new Error('Consulta não encontrada.')
    }
    return appointment
}