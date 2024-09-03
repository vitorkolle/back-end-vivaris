"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Import pacotes express
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
//Import pacotes cors
const cors_1 = __importDefault(require("cors"));
//Criação do app
const app = (0, express_1.default)();
//Criação das configurações das rotas para endpoint
const route = (0, express_2.Router)();
//Criação de endpoint
route.get('/', (0, cors_1.default)(), (request, response) => {
    response.json({ message: 'Wow! My first project in TypeScript!!!' });
});
//Ativação das rotas
app.use(route);
//Ativação na porta 8080
app.listen('8080', function () {
    console.log("API funcionando na porta 8080");
});
