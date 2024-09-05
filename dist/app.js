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
//Import Controller
const controller_usuario_1 = require("./src/controller/controller_usuario");
//Criação do app
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    app.use((0, cors_1.default)());
    next();
});
//Criação das configurações das rotas para endpoint
const route = (0, express_2.Router)();
/*********************************************************************************** */
//Post de Usuario
route.post('/cliente', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("ads");
    const contentType = req.header('content-type');
    const userData = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        telefone: req.body.telefone,
        cpf: req.body.cpf,
        data_nascimento: new Date(req.body.data_nascimento),
        sexo: req.body.sexo
    };
    let newUser = yield (0, controller_usuario_1.setInserirUsuario)(userData, contentType);
    res.status(newUser.status_code);
    res.json(newUser);
}));
//Ativação das rotas
app.use('/v1/vivaris', route);
route.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});
//Ativação na porta 8080
app.listen('8080', () => {
    console.log("API funcionando na porta 8080");
});
