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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
//Import pacotes express
var express_1 = require("express");
var express_2 = require("express");
//Import pacotes cors
var cors_1 = require("cors");
//Import Controller
var controller_usuario_1 = require("./src/controller/controller_usuario");
//Criação do app
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(function (request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    app.use((0, cors_1.default)());
    next();
});
//Criação das configurações das rotas para endpoint
var route = (0, express_2.Router)();
/*********************************************************************************** */
//Post de Usuario
route.post('/cliente', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contentType, userData, newUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                contentType = req.header('content-type');
                userData = {
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    telefone: req.body.telefone,
                    cpf: req.body.cpf,
                    data_nascimento: new Date(req.body.data_nascimento),
                    sexo: req.body.sexo
                };
                console.log(userData);
                return [4 /*yield*/, (0, controller_usuario_1.setInserirUsuario)(userData, contentType)];
            case 1:
                newUser = _a.sent();
                res.status(newUser.status_code);
                res.json(newUser);
                return [2 /*return*/];
        }
    });
}); });
//Ativação das rotas
app.use('/v1/vivaris', route);
route.use(function (req, res, next) {
    console.log("Request URL: ".concat(req.url));
    next();
});
//Ativação na porta 8080
app.listen('8080', function () {
    console.log("API funcionando na porta 8080");
});
