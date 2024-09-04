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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Import pacotes express
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
//Import pacotes cors
const cors_1 = __importDefault(require("cors"));
//Import pacotes body-parser
const body_parser_1 = __importDefault(require("body-parser"));
const bodyParserJSON = body_parser_1.default.json();
//Import Controller
const controller_usuario_1 = require("./controller/controller_usuario");
//Criação do app
const app = (0, express_1.default)();
//Criação das configurações das rotas para endpoint
const route = (0, express_2.Router)();
//Ativação das rotas
app.use(route);
/*********************************************************************************** */
//Post de Usuario
route.post('/v1/vivaris/cliente', bodyParserJSON, (0, cors_1.default)(), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const contentType = request.header('content-type');
    const userData = {
        nome: request.body.nome,
        email: request.body.email,
        senha: request.body.senha,
        telefone: request.body.telefone,
        cpf: request.body.cpf,
        data_nascimento: request.body.data_nascimento,
        sexo: request.body.sexo
    };
    let newUser = yield (0, controller_usuario_1.setInserirUsuario)(userData, contentType);
    response.status(newUser.status_code);
    response.json(newUser);
}));
//Ativação na porta 8080
app.listen('8080', function () {
    console.log("API funcionando na porta 8080");
});
