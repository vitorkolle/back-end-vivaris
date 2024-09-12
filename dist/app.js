"use strict";
//npx ts-node app.ts
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
//Criação das configurações das rotas para endpoint
const route = (0, express_2.Router)();
//Import pacotes cors 
const cors_1 = __importDefault(require("cors"));
//Import Controller 
const controller_usuario_1 = require("./src/controller/usuario/controller_usuario");
const controller_preferencia_1 = require("./src/controller/preferencia/controller_preferencia");
//Criação do app
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    app.use((0, cors_1.default)());
    next();
});
/****************************************************USUARIO****************************************************/
route.post('/cliente', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentType = req.header('content-type');
    const userData = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        telefone: req.body.telefone,
        cpf: req.body.cpf,
        data_nascimento: req.body.data_nascimento,
        id_sexo: req.body.id_sexo
    };
    console.log(userData);
    let newUser = yield (0, controller_usuario_1.setInserirUsuario)(userData, contentType);
    res.status(newUser.status_code);
    res.json(newUser);
}));
// de Preferências de Usuário
route.post('/cliente/preferencias', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentType = req.header('content-type');
    const userData = {
        id_cliente: req.body.id_cliente,
        preferencias: req.body.preferencias
    };
    let newUserPrefence = yield (0, controller_preferencia_1.setInserirPreferencias)(userData, contentType);
    res.status(newUserPrefence.status_code);
    res.json(newUserPrefence);
}));
/****************************************************GÊNERO****************************************************/
route.get('/cliente/sexo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let allSex = yield (0, controller_usuario_1.getListarSexo)();
    res.status(allSex.status_code);
    res.json(allSex);
}));
route.get('/cliente/sexo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let idFormat = Number(id);
    let buscarSexo = yield (0, controller_usuario_1.getBuscarSexo)(idFormat);
    res.status(buscarSexo.status_code);
    res.json(buscarSexo);
}));
//Ativação das rotas
app.use('/v1/vivaris', route);
//Ativação na porta 8080
app.listen('8080', () => {
    console.log("API funcionando na porta 8080");
});
