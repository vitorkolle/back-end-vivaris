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
//Import
const controller_avaliacao_1 = require("./src/controller/avaliacao/controller_avaliacao");
const controller_consulta_1 = require("./src/controller/consulta/controller_consulta");
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
const app = (0, express_1.default)();
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const middlewareJWT_1 = require("./middleware/middlewareJWT");
const controller_disponibilidade_1 = require("./src/controller/disponibilidade/controller_disponibilidade");
const controller_preferencia_1 = require("./src/controller/preferencia/controller_preferencia");
const controller_psicologo_1 = require("./src/controller/usuario/controller_psicologo");
const uuid_1 = require("uuid"); // Para gerar IDs únicos
const controller_usuario_1 = require("./src/controller/usuario/controller_usuario");
const controller_pagamento_1 = require("./src/controller/pagamento/controller_pagamento");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("./module/config");
const cors_1 = __importDefault(require("cors"));
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'], // Cabeçalhos permitidos
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use("/v1/vivaris", route);
/*****************************Autenticação/JWT****************************************************/
const verifyJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.header("x-access-token");
        if (!token) {
            return res.status(401).json("É necessário um token de autorização").end();
        }
        const authToken = yield (0, middlewareJWT_1.validateJWT)(token.toString());
        if (authToken) {
            next();
        }
        else {
            return res.status(401).end();
        }
    }
    catch (error) {
        console.error("Erro ao tentar autenticar usuário:", error);
        return res.status(401).json(config_1.ERROR_INVALID_AUTH_TOKEN.message).end();
    }
});
const verifyJWTRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.header("x-access-token");
        if (!token) {
            return res.status(401).json("É necessário um token de autorização").end();
        }
        let role = yield (0, middlewareJWT_1.getRole)(token.toString());
        if (role === "Função Inválida") {
            return res.status(401).json("Função Inválida").end();
        }
        const authToken = yield (0, middlewareJWT_1.validateJWTRole)(token.toString(), role);
        if (authToken) {
            next();
        }
        else {
            return res.status(401).end();
        }
    }
    catch (error) {
        console.error("Erro ao tentar autenticar usuário:", error);
        return res.status(401).json(config_1.ERROR_INVALID_AUTH_TOKEN.message).end();
    }
});
/******************************VideoChamada****************************************************/
const rooms = {};
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        methods: ["GET", "POST"],
        origin: "*",
    },
});
const connectedUsers = {};
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Usuário conectado: ${socket.id}`);
    // Salva o usuário conectado
    socket.on("registerUser", (userId) => {
        connectedUsers[userId] = socket.id;
        console.log(`Usuário registrado: ${userId} com ID de socket ${socket.id}`);
    });
    // Usuário A liga para Usuário B
    socket.on("callUser", ({ from, to }) => {
        const receiverSocketId = connectedUsers[to];
        if (!receiverSocketId) {
            socket.emit("callFailed", { message: "Usuário não está disponível." });
            return;
        }
        // Cria uma sala única para a chamada
        const roomId = (0, uuid_1.v4)();
        console.log(`Chamada iniciada de ${from} para ${to} na sala ${roomId}`);
        // Notifica o usuário B
        io.to(receiverSocketId).emit("incomingCall", { from, roomId });
    });
    // Usuário B aceita a chamada
    socket.on("acceptCall", ({ roomId, userId }) => {
        console.log(`Usuário ${userId} aceitou a chamada na sala ${roomId}`);
        socket.join(roomId);
        // Notifica a outra parte que a chamada foi aceita
        socket.to(roomId).emit("callAccepted", { userId });
    });
    socket.on("declineCall", ({ roomId, from }) => {
        console.log(`Usuário recusou a chamada na sala ${roomId}`);
        const callerSocketId = connectedUsers[from];
        if (callerSocketId) {
            io.to(callerSocketId).emit("callDeclined", { message: "Chamada recusada." });
        }
    });
    // Limpa o registro ao desconectar
    socket.on("disconnect", () => {
        const userId = Object.keys(connectedUsers).find((key) => connectedUsers[key] === socket.id);
        if (userId) {
            delete connectedUsers[userId];
            console.log(`Usuário ${userId} desconectado.`);
        }
    });
}));
server.listen("8080", () => {
    console.log("API funcionando na porta 8080");
});
/**********************************************STRIPE***************************************************************/
route.post("/webhook", express_1.default.raw({ type: "application/json" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.headers["stripe-signature"];
    if (!signature || typeof signature !== "string") {
        return res
            .status(400)
            .json({ error: "Invalid or missing Stripe signature" });
    }
    const event = stripe_1.default.webhooks.constructEvent(req.body, signature, process.env.STRIPE_ENDPOINT_SECRET);
    switch (event.type) {
        case "checkout.session.completed":
            try {
                const session = event.data.object;
                yield (0, controller_pagamento_1.confirmPayment)(session);
                yield (0, controller_pagamento_1.processarEventoCheckout)(session);
            }
            catch (error) {
                console.error("Erro ao processar evento:", error);
                return res.status(500).json({ error: "Erro no processamento do evento" });
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.json({ received: true });
}));
/****************************************************USUARIO-CLIENTE****************************************************/
app.use(express_1.default.json());
//post de clientes
route.post("/cliente", express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentType = req.header("content-type");
    const userData = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        telefone: req.body.telefone,
        cpf: req.body.cpf,
        data_nascimento: req.body.data_nascimento,
        id_sexo: req.body.id_sexo,
    };
    console.log(userData);
    let newUser = yield (0, controller_usuario_1.setInserirUsuario)(userData, contentType);
    res.status(newUser.status_code);
    res.json(newUser);
}));
//post de Preferências de Usuário
route.post("/cliente/preferencias", express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentType = req.header("content-type");
    const userData = {
        id_cliente: req.body.id_cliente,
        preferencias: req.body.preferencias,
    };
    let newUserPrefence = yield (0, controller_preferencia_1.setInserirPreferencias)(userData, contentType);
    res.status(newUserPrefence.status_code);
    res.json(newUserPrefence);
}));
//login de usuário
route.post("/login/usuario", express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let email = req.body.email;
    let senha = req.body.senha;
    let user = yield (0, controller_usuario_1.getLogarCliente)(email, senha);
    console.log(user);
    res.status(user.status_code);
    res.json(user);
}));
route.get("/usuario/:id", verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    let userData = yield (0, controller_usuario_1.getBuscarCliente)(id);
    res.status(userData.status_code);
    res.json(userData);
}));
route.get("/usuario/preferencias/:id", verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    let userData = yield (0, controller_usuario_1.getBuscarClientePreferencias)(id);
    res.status(userData.status_code);
    res.json(userData);
}));
route.get("/usuarios", verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let allUsers = yield (0, controller_usuario_1.getListarClientes)();
    res.status(allUsers.status_code);
    res.json(allUsers);
}));
/****************************************************GÊNERO****************************************************/
route.get("/sexo", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let allSex = yield (0, controller_usuario_1.getListarSexo)();
    res.status(allSex.status_code);
    res.json(allSex);
}));
route.get("/usuario/sexo/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    let idFormat = Number(id);
    let buscarSexo = yield (0, controller_usuario_1.getBuscarSexo)(idFormat);
    res.status(buscarSexo.status_code);
    res.json(buscarSexo);
}));
/****************************************************PSICÓLOGO****************************************************/
//post de psicólogos
route.post("/psicologo", express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentType = req.header("Content-Type");
    const professionalData = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        telefone: req.body.telefone,
        cpf: req.body.cpf,
        cip: req.body.cip,
        data_nascimento: req.body.data_nascimento,
        id_sexo: req.body.id_sexo,
        preco: req.body.preco
    };
    const newProfesional = yield (0, controller_psicologo_1.setInserirPsicologo)(professionalData, contentType);
    console.log(newProfesional);
    res.status(newProfesional.status_code);
    res.json(newProfesional);
}));
route.post("/profissional/login", express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let email = req.body.email;
    let senha = req.body.senha;
    let user = yield (0, controller_psicologo_1.getLogarPsicologo)(email, senha);
    console.log(user);
    res.status(user.status_code);
    res.json(user);
}));
route.get("/profissional/:id", verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const getUser = yield (0, controller_psicologo_1.getBuscarPsicologo)(id);
    res.status(getUser.status_code);
    res.json(getUser);
}));
route.get("/profissionais", verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getProfissionais = yield (0, controller_psicologo_1.getListarPsicologos)();
    res.status(getProfissionais.status_code);
    res.json(getProfissionais);
}));
/****************************************************DISPONIBILIDADE****************************************************/
route.post("/disponibilidade", express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentType = req.header("content-type");
    const disponibilidade = {
        dia_semana: req.body.dia_semana,
        horario_inicio: req.body.horario_inicio,
        horario_fim: req.body.horario_fim,
    };
    let rsDisponilidade = yield (0, controller_disponibilidade_1.setInserirDisponibilidade)(disponibilidade, contentType);
    console.log(disponibilidade);
    res.status(rsDisponilidade.status_code);
    res.json(rsDisponilidade);
}));
route.post("/disponibilidade/psicologo/:id", express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    const availability = {
        disponibilidade_id: req.body.disponibilidade,
        status: req.body.status,
        id_psicologo: id,
    };
    let rsDisponilidade = yield (0, controller_disponibilidade_1.criarDisponibilidadePsicologo)(availability);
    console.log(rsDisponilidade);
    res.status(rsDisponilidade.status_code);
    res.json(rsDisponilidade);
}));
route.get("/disponibilidade/psicologo/:id", verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    const professionalAvailbility = yield (0, controller_disponibilidade_1.getListarDisponibilidadesProfissional)(id);
    res.status(professionalAvailbility.status_code);
    res.json(professionalAvailbility);
}));
route.delete("/disponibilidades/psicologo/:id", verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    let diaSemana = String(req.body.dia_semana);
    const availabilityData = yield (0, controller_disponibilidade_1.setDeletarDisponibilidade)(diaSemana, id);
    console.log(availabilityData);
    res.status(availabilityData.status_code);
    res.json(availabilityData);
}));
route.get("/disponibilidade/:id", verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    const buscarDisponibilidade = yield (0, controller_disponibilidade_1.getBuscarDisponibilidade)(id);
    res.status(buscarDisponibilidade.status_code);
    res.json(buscarDisponibilidade);
}));
route.put("/disponibilidade/:id", verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const availabilityData = {
        dia_semana: req.body.dia_semana,
        horario_inicio: req.body.horario_inicio,
        horario_fim: req.body.horario_fim,
    };
    const contentType = req.header("content-type");
    let updateAvaibility = yield (0, controller_disponibilidade_1.setAtualizarDisponibilidade)(availabilityData, contentType, id);
    console.log(availabilityData, id);
    res.status(updateAvaibility.status_code);
    res.json(updateAvaibility);
}));
route.put("/psicologo/disponibilidade", verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const availabilityData = {
        id_psicologo: req.body.id_psicologo,
        disponibilidade_id: req.body.disponibilidade_id,
        status: req.body.status,
    };
    let contentType = req.header("content-type");
    let updateProfessionalAvailbility = yield (0, controller_disponibilidade_1.setAtualizarDisponibilidadeProfissional)(availabilityData, contentType);
    res.status(updateProfessionalAvailbility.status_code);
    res.json(updateProfessionalAvailbility);
}));
route.delete("/disponibilidade/psicologo/:id", verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let contentType = req.header("Content-Type");
    let professionalId = Number(req.params.id);
    let weekDay = req.body.dia_semana;
    let intialHour = req.body.horario_inicio;
    let deleteAvailbility = yield (0, controller_disponibilidade_1.setDeletarDisponibilidadeByHour)(weekDay, intialHour, professionalId, contentType);
    res.status(deleteAvailbility.status_code);
    res.json(deleteAvailbility);
}));
/****************************************************PREFERÊNCIAS****************************************************/
route.get("/preferencias", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let preferenceData = yield (0, controller_preferencia_1.getListarPreferencias)();
    console.log(preferenceData);
    res.status(preferenceData.status_code);
    res.json(preferenceData);
}));
route.get("/preferencias/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    let preferenceData = yield (0, controller_preferencia_1.getBuscarPreferencia)(id);
    res.status(preferenceData.status_code);
    res.json(preferenceData);
}));
/****************************************************PAGAMENTO****************************************************/
route.post('/create-checkout-session', verifyJWT, express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let idConsulta = req.body.id_consulta;
    let idCliente = req.body.id_cliente;
    const result = yield (0, controller_pagamento_1.createPaymentIntent)(idConsulta, idCliente);
    res.status(result.status_code);
    res.json(result);
}));
/*********************************Avaliação************************************/
route.post('/avaliacao', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let contentType = req.header('content-type');
    let inputData = {
        texto: req.body.texto,
        avaliacao: req.body.avaliacao,
        id_psicologo: req.body.id_psicologo,
        id_cliente: req.body.id_cliente,
    };
    let assessment = yield (0, controller_avaliacao_1.setCadastrarAvaliacao)(inputData, contentType);
    res.status(assessment.status_code);
    res.json(assessment);
}));
/*******************************Consulta*************************/
route.post('/consulta', express_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let contentType = req.header('content-type');
    let idProfessional = req.body.id_psicologo;
    let idClient = req.body.id_cliente;
    let appointmentDate = req.body.data_consulta;
    let newAppointment = yield (0, controller_consulta_1.setCadastrarConsulta)(idProfessional, idClient, appointmentDate, contentType);
    res.status(newAppointment.status_code);
    res.json(newAppointment);
}));
route.get('/consultas/psicologo/:id_psicologo', verifyJWTRole, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let idProfessional = Number(req.params.id_psicologo);
    if (!idProfessional) {
        return res.status(400).json({ error: 'O ID do psicólogo é obrigatório.' });
    }
    let consultas = yield (0, controller_consulta_1.getBuscarConsultasPorProfissional)(idProfessional);
    res.status(consultas.status_code);
    res.json(consultas);
}));
route.get('/consulta/:id', verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    let appointment = yield (0, controller_consulta_1.getBuscarConsulta)(id);
    res.status(appointment.status_code);
    res.json(appointment);
}));
route.delete('/consulta/:id', verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = Number(req.params.id);
    let deleteAppointment = yield (0, controller_consulta_1.setDeletarConsulta)(id);
    res.status(deleteAppointment.status_code);
    res.json(deleteAppointment);
}));
route.put('/consulta/:id', verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const contentType = req.header('content-type');
    const data = req.body.data_consulta;
    let updateAvaibility = yield (0, controller_consulta_1.setAtualizarConsulta)(id, data, contentType);
    res.status(updateAvaibility.status_code);
    res.json(updateAvaibility);
}));
route.get('/consulta/usuario/:id', verifyJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = Number(req.params.id);
    let appointment = yield (0, controller_consulta_1.getAllAppointmentByUserId)(userId);
    res.status(appointment.status_code);
    res.json(appointment);
}));
