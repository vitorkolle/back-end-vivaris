import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function criarNovoCliente(userInput:object) {
    const user = await prisma.user.create({
        data:{
            nome: userInput.nome,
            email:userInput.email,
            senha:userInput.senha,
            telefone:userInput.telefone,
            cpf:userInput.cpf,
            data_nascimento: userInput.data_nascimento,
            sexo:userInput.sexo,
        },
    })
    console.log(user);
    
    return user;
}