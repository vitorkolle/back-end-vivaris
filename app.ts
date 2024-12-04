//Import
import { getBuscarAvaliacoesPorPsicologo, setCadastrarAvaliacao } from './src/controller/avaliacao/controller_avaliacao'
import { TAssessment } from './src/domain/entities/assessment'
import { getAllAppointmentByUserId, getBuscarConsulta, getBuscarConsultasPorProfissional, setAtualizarConsulta, setCadastrarConsulta, setDeletarConsulta } from "./src/controller/consulta/controller_consulta";

import { TUser } from "./src/domain/entities/user-entity";
import { TUserPreferences } from "./src/domain/entities/user-preferences";

import express, { Router } from "express";
const route: Router = express.Router();
const app = express();

import { Server, Socket } from "socket.io";
import http from "http";
import {
  getRole,
  validateJWT,
  validateJWTRole,
} from "./middleware/middlewareJWT";

import {
  criarDisponibilidadePsicologo,
  getBuscarDisponibilidade,
  getListarDisponibilidadesProfissional,
  setAtualizarDisponibilidade,
  setAtualizarDisponibilidadeProfissional,
  setDeletarDisponibilidade,
  setDeletarDisponibilidadeByHour,
  setInserirDisponibilidade,
} from "./src/controller/disponibilidade/controller_disponibilidade";
import {
  getBuscarPreferencia,
  getListarPreferencias,
  setInserirPreferencias,
} from "./src/controller/preferencia/controller_preferencia";
import {
  getBuscarPsicologo,
  getListarPsicologos,
  getLogarPsicologo,
  setAtualizarPsicologo,
  setInserirPsicologo,
} from "./src/controller/usuario/controller_psicologo";
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs únicos
import {
  getBuscarCliente,
  getBuscarClientePreferencias,
  getBuscarSexo,
  getListarClientes,
  getListarSexo,
  getLogarCliente,
  setAtualizarCliente,
  setInserirUsuario,
} from "./src/controller/usuario/controller_usuario";
import { TAvailability } from "./src/domain/entities/availability-entity";
import { TProfessionalAvailability } from "./src/domain/entities/professional-availability";
import { TProfessional } from "./src/domain/entities/professional-entity";
import {
  confirmPayment,
  createPaymentIntent,
  processarEventoCheckout,
} from "./src/controller/pagamento/controller_pagamento";
import { ERROR_INVALID_AUTH_TOKEN } from "./module/config";

import cors from "cors";
import { selectUnavailableHours } from './src/model/DAO/consulta/consulta';
import { TEmotion } from './src/domain/entities/emotion-entity';
import { getBuscarEmocao, setAtualizarEmocao, setCriarEmocao } from './src/controller/emocoes/controller_emocoes';
import { TDiary } from './src/domain/entities/diary-entity';
import { getBuscarDiario, setAtualizarDiario, setDeletarDiario } from './src/controller/diario/controller_diario';
import { string } from 'zod';

const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'], // Cabeçalhos permitidos
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use("/v1/vivaris", route);

/*****************************Autenticação/JWT****************************************************/
const verifyJWT = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    let token = req.header("x-access-token");

    if (!token) {
      return res.status(401).json("É necessário um token de autorização").end();
    }

    const authToken = await validateJWT(token.toString());

    if (authToken) {
      next();
    } else {
      return res.status(401).end();
    }
  } catch (error) {
    console.error("Erro ao tentar autenticar usuário:", error);
    return res.status(401).json(ERROR_INVALID_AUTH_TOKEN.message).end();
  }
};

const verifyJWTRole = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    let token = req.header("x-access-token");

    if (!token) {
      return res.status(401).json("É necessário um token de autorização").end();
    }

    let role = await getRole(token.toString());

    if (role === "Função Inválida") {
      return res.status(401).json("Função Inválida").end();
    }

    const authToken = await validateJWTRole(token.toString(), role);

    if (authToken) {
      next();
    } else {
      return res.status(401).end();
    }
  } catch (error) {
    console.error("Erro ao tentar autenticar usuário:", error);
    return res.status(401).json(ERROR_INVALID_AUTH_TOKEN.message).end();
  }
};

/******************************VideoChamada****************************************************/
const rooms: Record<string, string[]> = {};


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
    origin: "*",
  },
});


// Mova a definição de connectedUsers para o escopo global
const connectedUsers: any = {};  // Armazenar único socket por usuário

io.on("connection", (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  // Quando o usuário se registrar
  socket.on("registerUser", (userId: string) => {
    // Verifica se o usuário já tem algum socket registrado
    if (connectedUsers[userId]) {
      const oldSocketId = connectedUsers[userId];

      // Se já tiver um socket registrado, desconecta o anterior
      if (oldSocketId !== socket.id) {
        io.to(oldSocketId).emit("forceDisconnect", { message: "Você foi desconectado devido a uma nova conexão." });
        console.log(`Usuário ${userId} foi desconectado do socket ${oldSocketId} por uma nova conexão`);
      }
    }
  // Para emitir a chamada para o usuário, pegando o único socket registrado
  socket.on("callUser", ({ from, to }) => {
    console.log(`Tentando chamar ${to} de ${from}`);
    console.log(connectedUsers);

    const receiverSocketId = connectedUsers[to];
    console.log(receiverSocketId);

    if (!receiverSocketId) {
      console.log(`Usuário ${to} não está disponível.`);
      socket.emit("callFailed", { message: "Usuário não está disponível." });
      return;
    }

    // Cria um ID único para a sala
    const roomId = uuidv4();
    console.log(`Chamada iniciada de ${from} para ${to} na sala ${roomId}`);
    console.log(`Enviando chamada para o socket: ${receiverSocketId}`);

    // Envia a notificação de chamada para o usuário B
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
    // Encontra e remove o socket desconectado
    for (const userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];  // Remove o usuário da lista
        console.log(`Usuário ${userId} desconectado e removido da lista.`);
        break;
      }
    }
  });
});



server.listen("8080", () => {
  console.log("API funcionando na porta 8080");
})

/**********************************************STRIPE***************************************************************/
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
route.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {

  const signature = req.headers['stripe-signature'];

  if (!signature || typeof signature !== "string") {

    return res
      .status(400)
      .json({ error: "Invalid or missing Stripe signature" });
  }

  const event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    process.env.STRIPE_ENDPOINT_SECRET
  );

  switch (event.type) {
    case "checkout.session.completed":
      try {
        console.log('vadtyavsdsa')

        const session = event.data.object

        await confirmPayment(session);

        await processarEventoCheckout(session);

      } catch (error) {
        console.error("Erro ao processar evento:", error);
        return res.status(500).json({ error: "Erro no processamento do evento" });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

/****************************************************USUARIO-CLIENTE****************************************************/
//post de clientes
route.post("/cliente", express.json(), async (req, res) => {

  const contentType = req.header("content-type");

  const userData: TUser = {
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha,
    telefone: req.body.telefone,
    cpf: req.body.cpf,
    data_nascimento: req.body.data_nascimento,
    id_sexo: req.body.id_sexo,
  };
  console.log(userData);

  let newUser = await setInserirUsuario(userData, contentType);

  res.status(newUser.status_code);
  res.json(newUser);
});

//post de Preferências de Usuário
route.post("/cliente/preferencias", express.json(), async (req, res) => {

  const contentType = req.header("content-type");

  const userData: TUserPreferences = {
    id_cliente: req.body.id_cliente,
    preferencias: req.body.preferencias,
  };

  let newUserPrefence = await setInserirPreferencias(userData, contentType);

  res.status(newUserPrefence.status_code);
  res.json(newUserPrefence);
});

//login de usuário
route.post("/login/usuario", express.json(), async (req, res) => {

  let email = req.body.email;
  let senha = req.body.senha;

  let user = await getLogarCliente(email, senha);

  console.log(user);

  res.status(user.status_code);
  res.json(user);
});

route.get("/usuario/:id", verifyJWT, async (req, res) => {
  let id = Number(req.params.id);

  let userData = await getBuscarCliente(id);

  res.status(userData.status_code);
  res.json(userData);
});

route.get("/usuario/preferencias/:id", verifyJWT, async (req, res) => {
  let id = Number(req.params.id);

  let userData = await getBuscarClientePreferencias(id);

  res.status(userData.status_code);
  res.json(userData);
});

route.get("/usuarios", verifyJWT, async (req, res) => {
  let allUsers = await getListarClientes();

  res.status(allUsers.status_code);
  res.json(allUsers);
});

route.put("/usuario/:id", express.json(), verifyJWT, async (req, res) => {
  const id = Number(req.params.id);
  const contentType = req.header("content-type");

  const userData: TUser = {
    nome: req.body.nome,
    email: req.body.email,
    senha: req.body.senha,
    telefone: req.body.telefone,
    cpf: req.body.cpf,
    data_nascimento: req.body.data_nascimento,
    id_sexo: req.body.id_sexo
  }

  let updateUser = await setAtualizarCliente(id, userData, contentType);

  res.status(updateUser.status_code);
  res.json(updateUser);
})

/****************************************************GÊNERO****************************************************/
route.get("/sexo", async (req, res) => {
  let allSex = await getListarSexo();

  res.status(allSex.status_code);
  res.json(allSex);
});

route.get("/usuario/sexo/:id", async (req, res) => {
  let id = req.params.id;
  let idFormat = Number(id);

  let buscarSexo = await getBuscarSexo(idFormat);

  res.status(buscarSexo.status_code);
  res.json(buscarSexo);
});

/****************************************************PSICÓLOGO****************************************************/

//post de psicólogos
route.post("/psicologo", express.json(), async (req, res) => {

  const contentType = req.header("Content-Type");

  const professionalData: TProfessional = {
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

  const newProfesional = await setInserirPsicologo(
    professionalData,
    contentType
  );

  console.log(newProfesional);

  res.status(newProfesional.status_code);
  res.json(newProfesional);
});

route.post("/profissional/login", express.json(), async (req, res) => {

  let email = req.body.email;
  let senha = req.body.senha;

  let user = await getLogarPsicologo(email, senha);

  console.log(user);

  res.status(user.status_code);
  res.json(user);
});

route.get("/profissional/:id", verifyJWT, async (req, res) => {
  const id = Number(req.params.id);

  const getUser = await getBuscarPsicologo(id);

  res.status(getUser.status_code);
  res.json(getUser);
});

route.get("/profissionais", verifyJWT, async (req, res) => {
  const getProfissionais = await getListarPsicologos();

  res.status(getProfissionais.status_code);
  res.json(getProfissionais);
});

route.put("/profissional/:id", express.json(), verifyJWT, async (req, res) => {
  const id = Number(req.params.id);
  const contentType = req.header("content-type");

  const professionalData: TProfessional = {
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

  let updateProfessional = await setAtualizarPsicologo(professionalData, contentType, id);

  res.status(updateProfessional.status_code);
  res.json(updateProfessional);
});

/****************************************************DISPONIBILIDADE****************************************************/
route.post("/disponibilidade", express.json(), async (req, res) => {

  const contentType = req.header("content-type");

  const disponibilidade: TAvailability = {
    dia_semana: req.body.dia_semana,
    horario_inicio: req.body.horario_inicio,
    horario_fim: req.body.horario_fim,
  };

  let rsDisponilidade = await setInserirDisponibilidade(
    disponibilidade,
    contentType
  );

  console.log(disponibilidade);

  res.status(rsDisponilidade.status_code);
  res.json(rsDisponilidade);
});

route.post("/disponibilidade/psicologo/:id", express.json(), async (req, res) => {

  let id = Number(req.params.id);

  const availability: TProfessionalAvailability = {
    disponibilidade_id: req.body.disponibilidade,
    status: req.body.status,
    id_psicologo: id,
  };

  let rsDisponilidade = await criarDisponibilidadePsicologo(availability);

  console.log(rsDisponilidade);

  res.status(rsDisponilidade.status_code!!);
  res.json(rsDisponilidade);
});

route.get("/disponibilidade/psicologo/:id", verifyJWT, async (req, res) => {
  let id = Number(req.params.id);

  const professionalAvailbility = await getListarDisponibilidadesProfissional(
    id
  );

  res.status(professionalAvailbility.status_code);
  res.json(professionalAvailbility);
});

route.delete("/disponibilidades/psicologo/:id", verifyJWT, async (req, res) => {
  let id = Number(req.params.id);
  let diaSemana = String(req.body.dia_semana);

  const availabilityData = await setDeletarDisponibilidade(diaSemana, id);

  console.log(availabilityData);

  res.status(availabilityData.status_code);
  res.json(availabilityData);
});

route.get("/disponibilidade/:id", verifyJWT, async (req, res) => {
  let id = Number(req.params.id);

  const buscarDisponibilidade = await getBuscarDisponibilidade(id);

  res.status(buscarDisponibilidade.status_code);
  res.json(buscarDisponibilidade);
});

route.put("/disponibilidade/:id", verifyJWT, express.json(), async (req, res) => {
  const id = Number(req.params.id);

  const availabilityData: TAvailability = {
    dia_semana: req.body.dia_semana,
    horario_inicio: req.body.horario_inicio,
    horario_fim: req.body.horario_fim,
  };

  const contentType = req.header("content-type");

  let updateAvaibility = await setAtualizarDisponibilidade(
    availabilityData,
    contentType,
    id
  );

  console.log(availabilityData, id);

  res.status(updateAvaibility.status_code);
  res.json(updateAvaibility);
});

route.put("/psicologo/disponibilidade", verifyJWT, express.json(), async (req, res) => {
  const availabilityData: TProfessionalAvailability = {
    id_psicologo: req.body.id_psicologo,
    disponibilidade_id: req.body.disponibilidade_id,
    status: req.body.status,
  };

  let contentType = req.header("content-type");

  let updateProfessionalAvailbility =
    await setAtualizarDisponibilidadeProfissional(
      availabilityData,
      contentType
    );

  res.status(updateProfessionalAvailbility.status_code);
  res.json(updateProfessionalAvailbility);
});

route.delete("/disponibilidade/psicologo/:id", verifyJWT, async (req, res) => {

  let contentType = req.header("Content-Type");
  let professionalId = Number(req.params.id);
  let weekDay = req.body.dia_semana;
  let intialHour = req.body.horario_inicio;

  let deleteAvailbility = await setDeletarDisponibilidadeByHour(
    weekDay,
    intialHour,
    professionalId,
    contentType
  );

  res.status(deleteAvailbility.status_code);
  res.json(deleteAvailbility);
});

/****************************************************PREFERÊNCIAS****************************************************/
route.get("/preferencias", async (req, res) => {
  let preferenceData = await getListarPreferencias();

  console.log(preferenceData);

  res.status(preferenceData.status_code);
  res.json(preferenceData);
});

route.get("/preferencias/:id", async (req, res) => {
  let id = Number(req.params.id);

  let preferenceData = await getBuscarPreferencia(id);

  res.status(preferenceData.status_code);
  res.json(preferenceData);
});

/****************************************************PAGAMENTO****************************************************/
route.post('/create-checkout-session', verifyJWT, express.json(), async (req, res) => {


  let idConsulta = req.body.id_consulta

  let idCliente = req.body.id_cliente

  const result = await createPaymentIntent(idConsulta, idCliente)


  res.status(result.status_code)
  res.json(result)

})

/*********************************Avaliação************************************/
route.post('/avaliacao', verifyJWT, express.json(), async (req, res) => {
  let contentType = req.header('content-type')

  let inputData: TAssessment = {
    texto: req.body.texto,
    avaliacao: req.body.avaliacao,
    id_psicologo: req.body.id_psicologo,
    id_cliente: req.body.id_cliente,
  }

  let assessment = await setCadastrarAvaliacao(inputData, contentType)

  res.status(assessment.status_code)
  res.json(assessment)
})

route.get('/avaliacoes/:idPsicologo', verifyJWT, async (req, res) => {
  let idPsicologo = Number(req.params.idPsicologo)

  if (!idPsicologo) {
    return res.status(400).json({ error: 'O ID do psicólogo é obrigatório.' });
  }

  let assessments = await getBuscarAvaliacoesPorPsicologo(idPsicologo)

  res.status(assessments.status_code)
  res.json(assessments)
})


/*******************************Consulta*************************/
route.post('/consulta', express.json(), verifyJWT, async (req, res) => {
  let contentType = req.header('content-type')

  let idProfessional = req.body.id_psicologo

  let idClient = req.body.id_cliente

  let appointmentDate = req.body.data_consulta

  let newAppointment = await setCadastrarConsulta(idProfessional, idClient, appointmentDate, contentType)

  res.status(newAppointment.status_code)
  res.json(newAppointment)
})



route.get('/consultas/psicologo/:id_psicologo', verifyJWT, async (req, res) => {

  let idProfessional = Number(req.params.id_psicologo)

  if (!idProfessional) {
    return res.status(400).json({ error: 'O ID do psicólogo é obrigatório.' });
  }

  let consultas = await getBuscarConsultasPorProfissional(idProfessional)

  res.status(consultas.status_code)
  res.json(consultas)
})

route.get('/v1/vivaris/consulta/horarios', async (req, res) => {
  const { data, psicologoId } = req.query;

  if (!data || !psicologoId) {
    return res.status(400).json({ error: 'Data e psicologoId são obrigatórios.' });
  }

  try {
    const startOfDay = `${data} 00:00:00`;
    const endOfDay = `${data} 23:59:59`;

    const results = await selectUnavailableHours(Number(psicologoId), startOfDay, endOfDay);

    const unavailableTimes = results.map(row =>
      new Date(row.data_consulta).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );

    return res.json({ unavailableTimes });
  } catch (error) {
    console.error('Erro ao buscar horários indisponíveis:', error);
    return res.status(500).json({ error: 'Erro ao buscar horários indisponíveis.' });
  }
});

route.get('/consulta/:id', verifyJWT, async (req, res) => {
  let id = Number(req.params.id)

  let appointment = await getBuscarConsulta(id)

  res.status(appointment.status_code)
  res.json(appointment)
})

route.delete('/consulta/:id', verifyJWT, async (req, res) => {
  let id = Number(req.params.id)

  let deleteAppointment = await setDeletarConsulta(id)

  res.status(deleteAppointment.status_code)
  res.json(deleteAppointment)
})

route.put('/consulta/:id', express.json(), verifyJWT, async (req, res) => {
  const id = Number(req.params.id)
  const contentType = req.header('content-type')
  const data = req.body.data_consulta

  let updateAvaibility = await setAtualizarConsulta(id, data, contentType)

  res.status(updateAvaibility.status_code)
  res.json(updateAvaibility)
})

route.get('/consulta/usuario/:id', verifyJWT, async (req, res) => {
  const contentType = req.header('content-type')

  let userId = Number(req.params.id)
  let appointment = await getAllAppointmentByUserId(userId)

  res.status(appointment.status_code)
  res.json(appointment)
})

/*******************************Emoção*************************/
// ! caso a emoção tenha nome composto, ela deve ser enviada com a primeira palavra em maiúsculo e com underscore para a outra palavra
// * ex: "Muito_feliz"
route.post('/emocao', express.json(), verifyJWT, async (req, res) => {
  let contentType = req.header('content-type')

  const inputData: TEmotion = {
    emocao: req.body.emocao,
    data: req.body.data,
    id_cliente: req.body.id_cliente
  }

  let emotion = await setCriarEmocao(inputData, contentType)

  res.status(emotion.status_code)
  res.json(emotion)
})

route.get('/emocao/:id', verifyJWT, async (req, res) => {
  let id = Number(req.params.id)

  let emotion = await getBuscarEmocao(id)

  res.status(emotion.status_code)
  res.json(emotion)
})

route.put('/emocao/:id', express.json(), verifyJWT, async (req, res) => {
  const id = Number(req.params.id)
  const contentType = req.header('content-type')
  const inputEmotion: TEmotion = {
    emocao: req.body.emocao,
    data: req.body.data,
    id_cliente: req.body.id_cliente
  }

  let updateEmotion = await setAtualizarEmocao(inputEmotion, id, contentType)

  res.status(updateEmotion.status_code)
  res.json(updateEmotion)
})

/************************************DIÁRIO************************************/
route.put('/diario/:id', express.json(), verifyJWT, async (req, res) => {
  const id = Number(req.params.id)

  const contentType = req.header('content-type')

  const inputDiary: TDiary = {
    anotacoes: req.body.anotacoes,
    data_diario: req.body.data_diario,
    id_cliente: req.body.id_cliente,
    id_humor: req.body.id_humor
  }

  let updateDiary = await setAtualizarDiario(inputDiary, id, contentType)

  res.status(updateDiary.status_code)
  res.json(updateDiary)
})

route.delete('/diario/:id', verifyJWT, async (req, res) => {
  const id = Number(req.params.id)

  let deleteDiary = await setDeletarDiario(id)

  res.status(deleteDiary.status_code)
  res.json(deleteDiary)
})

route.get('/diario/:id', verifyJWT, async (req, res) => {
  const id = Number(req.params.id)

  let diary = await getBuscarDiario(id)

  res.status(diary.status_code)
  res.json(diary)
})