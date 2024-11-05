"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
<<<<<<< Updated upstream
//Import pacotes express
const express_1 = __importStar(require("express"));
//Criação das configurações das rotas para endpoint 
const route = (0, express_1.Router)();
//Import pacotes cors 
const cors_1 = __importDefault(require("cors"));
=======
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const cors_1 = __importDefault(require("cors"));
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use('/v1/vivaris', route);
app.listen('8080', () => {
    console.log("API funcionando na porta 8080");
});
>>>>>>> Stashed changes
//Import Controller 
const controller_disponibilidade_1 = require("./src/controller/disponibilidade/controller_disponibilidade");
const controller_preferencia_1 = require("./src/controller/preferencia/controller_preferencia");
const controller_psicologo_1 = require("./src/controller/usuario/controller_psicologo");
const controller_usuario_1 = require("./src/controller/usuario/controller_usuario");
const controller_pagamento_1 = require("./src/controller/pagamento/controller_pagamento");
const controller_cartao_1 = require("./src/controller/cartao/controller_cartao");
<<<<<<< Updated upstream
const body_parser_1 = __importDefault(require("body-parser"));
//Criação do app
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    app.use((0, cors_1.default)());
    next();
});
=======
>>>>>>> Stashed changes
/****************************************************USUARIO-CLIENTE****************************************************/
//post de clientes
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
//post de Preferências de Usuário
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
//login de usuário
route.post('/login/usuario', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let email = req.body.email;
    let senha = req.body.senha;
    let user = yield (0, controller_usuario_1.getLogarCliente)(email, senha);
    console.log(user);
    res.status(user.status_code);
    res.json(user);
}));
route.get('/usuario/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    let userData = yield (0, controller_usuario_1.getBuscarCliente)(id);
    res.status(userData.status_code);
    res.json(userData);
}));
route.get('/usuario/preferencias/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    let userData = yield (0, controller_usuario_1.getBuscarClientePreferencias)(id);
    res.status(userData.status_code);
    res.json(userData);
}));
/****************************************************GÊNERO****************************************************/
route.get('/sexo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let allSex = yield (0, controller_usuario_1.getListarSexo)();
    res.status(allSex.status_code);
    res.json(allSex);
}));
route.get('/usuario/sexo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let idFormat = Number(id);
    let buscarSexo = yield (0, controller_usuario_1.getBuscarSexo)(idFormat);
    res.status(buscarSexo.status_code);
    res.json(buscarSexo);
}));
/****************************************************PSICÓLOGO****************************************************/
//post de psicólogos
route.post('/psicologo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentType = req.header('Content-Type');
    const professionalData = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        telefone: req.body.telefone,
        cpf: req.body.cpf,
        cip: req.body.cip,
        data_nascimento: req.body.data_nascimento,
        id_sexo: req.body.id_sexo
    };
    const newProfesional = yield (0, controller_psicologo_1.setInserirPsicologo)(professionalData, contentType);
    console.log(newProfesional);
    res.status(newProfesional.status_code);
    res.json(newProfesional);
}));
route.post('/profissional/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let email = req.body.email;
    let senha = req.body.senha;
    let user = yield (0, controller_psicologo_1.getLogarPsicologo)(email, senha);
    console.log(user);
    res.status(user.status_code);
    res.json(user);
}));
route.get('/profissional/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const getUser = yield (0, controller_psicologo_1.getBuscarPsicologo)(id);
    res.status(getUser.status_code);
    res.json(getUser);
}));
/****************************************************DISPONIBILIDADE****************************************************/
route.post('/disponibilidade', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentType = req.header('content-type');
    const disponibilidade = {
        dia_semana: req.body.dia_semana,
        horario_inicio: req.body.horario_inicio,
        horario_fim: req.body.horario_fim
    };
    let rsDisponilidade = yield (0, controller_disponibilidade_1.setInserirDisponibilidade)(disponibilidade, contentType);
    console.log(disponibilidade);
    res.status(rsDisponilidade.status_code);
    res.json(rsDisponilidade);
}));
route.post('/disponibilidade/psicologo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    const availability = {
        disponibilidade_id: req.body.disponibilidade,
        status: req.body.status,
        id_psicologo: id
    };
    let rsDisponilidade = yield (0, controller_disponibilidade_1.criarDisponibilidadePsicologo)(availability);
    console.log(rsDisponilidade);
    res.status(rsDisponilidade.status_code);
    res.json(rsDisponilidade);
}));
route.get('/disponibilidade/psicologo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    const professionalAvailbility = yield (0, controller_disponibilidade_1.getListarDisponibilidadesProfissional)(id);
    res.status(professionalAvailbility.status_code);
    res.json(professionalAvailbility);
}));
route.delete('/disponibilidade/psicologo/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    let diaSemana = String(req.body.dia_semana);
    const availabilityData = yield (0, controller_disponibilidade_1.setDeletarDisponibilidade)(diaSemana, id);
    console.log(availabilityData);
    res.status(availabilityData.status_code);
    res.json(availabilityData);
}));
route.get('/disponibilidade/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    const buscarDisponibilidade = yield (0, controller_disponibilidade_1.getBuscarDisponibilidade)(id);
    res.status(buscarDisponibilidade.status_code);
    res.json(buscarDisponibilidade);
}));
route.put('/disponibilidade/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const availabilityData = {
        dia_semana: req.body.dia_semana,
        horario_inicio: req.body.horario_inicio,
        horario_fim: req.body.horario_fim
    };
    const contentType = req.header('content-type');
    let updateAvaibility = yield (0, controller_disponibilidade_1.setAtualizarDisponibilidade)(availabilityData, contentType, id);
    console.log(availabilityData, id);
    res.status(updateAvaibility.status_code);
    res.json(updateAvaibility);
}));
route.put('/psicologo/disponibilidade', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const availabilityData = {
        id_psicologo: req.body.id_psicologo,
        disponibilidade_id: req.body.disponibilidade_id,
        status: req.body.status
    };
    let contentType = req.header('content-type');
    let updateProfessionalAvailbility = yield (0, controller_disponibilidade_1.setAtualizarDisponibilidadeProfissional)(availabilityData, contentType);
    res.status(updateProfessionalAvailbility.status_code);
    res.json(updateProfessionalAvailbility);
}));
/****************************************************PREFERÊNCIAS****************************************************/
route.get('/preferencias', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let preferenceData = yield (0, controller_preferencia_1.getListarPreferencias)();
    console.log(preferenceData);
    res.status(preferenceData.status_code);
    res.json(preferenceData);
}));
route.get('/preferencias/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    let preferenceData = yield (0, controller_preferencia_1.getBuscarPreferencia)(id);
    res.status(preferenceData.status_code);
    res.json(preferenceData);
}));
/****************************************************PAGAMENTO****************************************************/
route.post('/create-checkout-session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let idConsulta = Number(req.body.id_consulta);
        let idCliente = Number(req.body.id_cliente);
        const result = yield (0, controller_pagamento_1.createPaymentIntent)(idConsulta, idCliente);
        res.status(200).send(result);
    }
    catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send({ error: 'Failed to create checkout session' });
    }
}));
route.post('/webhook', body_parser_1.default.raw({ type: 'application/json' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    // } catch (error) {
    //     console.error('Erro ao processar webhook:', error);
    //     res.statu    s(400).send({ error: 'Erro no Webhook' });
    // }
    const signature = req.headers['stripe-signature'];
    const event = req.body;
    let result;
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!');
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            console.log('PaymentMethod was attached to a Customer!');
            break;
        case 'checkout.session.completed':
            result = yield (0, controller_pagamento_1.confirmPayment)(req.body, signature);
            console.log("result: ", result);
            console.log('OK');
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).send(result);
}));
route.post('/webhook', express_1.default.raw({ type: 'application/json' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const event = req.body;
    const result = (0, controller_pagamento_1.confirmPayment)(event, req.headers['stripe-signature']);
    res.json(result);
}));
/*****************************************************CARTOES*************************************************/
route.post('/cartao', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cardData = {
        modalidade: req.body.modalidade,
        numero_cartao: req.body.numero_cartao,
        nome: req.body.nome,
        validade: req.body.validade,
        cvc: req.body.cvc
    };
    let contentType = req.header('Content-Type');
    let newCard = yield (0, controller_cartao_1.setCadastrarCartao)(cardData, contentType);
    res.status(newCard.status_code);
    res.json(newCard);
}));
route.get('/cartao/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    let id = Number(req.params.id);
    let card = yield (0, controller_cartao_1.getBuscarCartao)(id);
    res.status(card.status_code);
    res.json(card);
}));
route.delete('/cartao/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    let deleteCard = yield (0, controller_cartao_1.setDeletarCartao)(id);
    res.status(deleteCard.status_code);
    res.json(deleteCard);
}));
// Configurações do CORS
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
//Ativação das rotas
app.use('/v1/vivaris', route);
//Ativação na porta 8080
app.listen('8080', () => {
    console.log("API funcionando na porta 8080");
});
