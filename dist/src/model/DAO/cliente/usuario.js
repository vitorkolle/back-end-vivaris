"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarNovoCliente = criarNovoCliente;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function criarNovoCliente(userInput) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield prisma.tbl_clientes.create({
                data: {
                    nome: userInput.nome,
                    email: userInput.email,
                    senha: userInput.senha,
                    telefone: userInput.telefone,
                    cpf: userInput.cpf,
                    data_nascimento: userInput.data_nascimento,
                    id_sexo: userInput.id_sexo,
                },
            });
            console.log(user);
            console.log("oi");
            return user;
        }
        catch (error) {
            console.error("Erro ao criar novo cliente:", error);
            throw new Error("Não foi possível criar o cliente.");
        }
    });
}
// export async function criarPreferenciasUsuario(userId: number, preferences: number[]):Promise<void>{
//   try{
//     const userPreferences: number[]
//     preferences.map((preference => {
//       const result = await prisma.tbl_clientes_preferencias.create({
//         data: {
//           id_cliente: userId,
//           id_preferencia: preference,
//         },
//       });
//       userPreferences.push(result)
//       console.log(userPreferences);
//     }))
//     return userPreferences
//   } catch (error){
//     console.error("Erro ao gravar preferências do cliente:", error);
//     throw new Error("Não foi possível gravar as preferências do cliente.");
//   }
// }
