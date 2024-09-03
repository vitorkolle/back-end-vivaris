"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Import pacotes express
var express_1 = require("express");
var express_2 = require("express");
//Import pacotes cors
var cors_1 = require("cors");
//Criação do app
var app = (0, express_1.default)();
var route = (0, express_2.Router)();
app.use(express_1.default.json());
route.get('/', (0, cors_1.default)(), function (request, response) {
    response.json({ message: 'Wow! My first project in TypeScript!!!' });
});
app.use(route);
//Ativação na porta 8080
app.listen('8080', function () {
    console.log("API funcionando na porta 8080");
});
