//Import
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
  setInserirPsicologo,
} from "./src/controller/usuario/controller_psicologo";
import {
  getBuscarCliente,
  getBuscarClientePreferencias,
  getBuscarSexo,
  getListarClientes,
  getListarSexo,
  getLogarCliente,
  setInserirUsuario,
} from "./src/controller/usuario/controller_usuario";
import { TAvailability } from "./src/domain/entities/availability-entity";
import { TProfessionalAvailability } from "./src/domain/entities/professional-availability";
import { TProfessional } from "./src/domain/entities/professional-entity";
import {
  confirmPayment,
  createPaymentIntent,
} from "./src/controller/pagamento/controller_pagamento";
import stripe from "stripe";
import { ERROR_INVALID_AUTH_TOKEN } from "./module/config";

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

import cors from "cors";
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token'], // Cabeçalhos permitidos
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

app.use("/v1/vivaris", route);


/******************************VideoChamada****************************************************/
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs únicos

const rooms: Record<string, string[]> = {};


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
    origin: "*",
  },
});

const connectedUsers: Record<string, string> = {};


io.on("connection", async (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);

    // Salva o usuário conectado
    socket.on("registerUser", (userId: string) => {
      connectedUsers[userId] = socket.id;
      console.log(`Usuário registrado: ${userId} com ID de socket ${socket.id}`);
    });
  
    // Usuário A liga para Usuário B
    socket.on("callUser", ({ from, to }: { from: string; to: string }) => {
      const receiverSocketId = connectedUsers[to];
  
      if (!receiverSocketId) {
        socket.emit("callFailed", { message: "Usuário não está disponível." });
        return;
      }
  
      // Cria uma sala única para a chamada
      const roomId = uuidv4();
      console.log(`Chamada iniciada de ${from} para ${to} na sala ${roomId}`);
  
      // Notifica o usuário B
      io.to(receiverSocketId).emit("incomingCall", { from, roomId });
    });
  
    // Usuário B aceita a chamada
    socket.on("acceptCall", ({ roomId, userId }: { roomId: string; userId: string }) => {
      console.log(`Usuário ${userId} aceitou a chamada na sala ${roomId}`);
      socket.join(roomId);
  
      // Notifica a outra parte que a chamada foi aceita
      socket.to(roomId).emit("callAccepted", { userId });
    });

    socket.on("declineCall", ({ roomId, from }: { roomId: string; from: string }) => {
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
  
});

server.listen("8080", () => {
    console.log("API funcionando na porta 8080");
})


//Import 
import { setCadastrarAvaliacao } from './src/controller/avaliacao/controller_avaliacao'
import { TAssessment } from './src/domain/entities/assessment'
import { getBuscarConsulta, setCadastrarConsulta, setDeletarConsulta } from "./src/controller/consulta/controller_consulta";


/**********************************************STRIPE***************************************************************/
route.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];

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
        const session = event.data.object;

        await confirmPayment(session);

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);
/****************************************************USUARIO-CLIENTE****************************************************/
//post de clientes
route.post("/cliente", async (req, res) => {
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
route.post("/cliente/preferencias", async (req, res) => {
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
route.post("/login/usuario", async (req, res) => {
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

/****************************************************GÊNERO****************************************************/
route.get("/sexo", verifyJWT, async (req, res) => {
  let allSex = await getListarSexo();

  res.status(allSex.status_code);
  res.json(allSex);
});

route.get("/usuario/sexo/:id", verifyJWT, async (req, res) => {
  let id = req.params.id;
  let idFormat = Number(id);

  let buscarSexo = await getBuscarSexo(idFormat);

  res.status(buscarSexo.status_code);
  res.json(buscarSexo);
});

/****************************************************PSICÓLOGO****************************************************/

//post de psicólogos
route.post("/psicologo", async (req, res) => {
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

route.post("/profissional/login", async (req, res) => {
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

/****************************************************DISPONIBILIDADE****************************************************/
route.post("/disponibilidade", async (req, res) => {
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

route.post("/disponibilidade/psicologo/:id", async (req, res) => {
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

route.put("/disponibilidade/:id", verifyJWT, async (req, res) => {
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

route.put("/psicologo/disponibilidade", verifyJWT, async (req, res) => {
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
route.get("/preferencias", verifyJWT, async (req, res) => {
  let preferenceData = await getListarPreferencias();

  console.log(preferenceData);

  res.status(preferenceData.status_code);
  res.json(preferenceData);
});

route.get("/preferencias/:id", verifyJWT, async (req, res) => {
  let id = Number(req.params.id);

  let preferenceData = await getBuscarPreferencia(id);

  res.status(preferenceData.status_code);
  res.json(preferenceData);
});

/****************************************************PAGAMENTO****************************************************/
route.post('/create-checkout-session', verifyJWT, async (req, res) => {
    let idConsulta = req.body.id_consulta
    
    let idCliente = req.body.id_cliente

   const result = await createPaymentIntent(idConsulta, idCliente)

    res.status(result.status_code)
    res.json(result)

})

/*********************************Avaliação************************************/
route.post('/avaliacao', async (req, res) => {
    let contentType = req.header('content-type')

    let inputData: TAssessment= {
        texto: req.body.texto,
        avaliacao: req.body.avaliacao,
        id_psicologo: req.body.id_psicologo,
        id_cliente: req.body.id_cliente,
    }

    let assessment = await setCadastrarAvaliacao( inputData, contentType)

    res.status(assessment.status_code)
    res.json(assessment)
})


/*******************************Consulta*************************/
route.post('/consulta', async (req, res) => {
    let contentType = req.header('content-type')

   let idProfessional = req.body.id_psicologo

   let idClient = req.body.id_cliente

   let appointmentDate = req.body.data_consulta

   let newAppointment = await setCadastrarConsulta(idProfessional, idClient, appointmentDate, contentType)

   res.status(newAppointment.status_code)
   res.json(newAppointment)
})

route.get('/consulta/:id', async (req, res) => {
    let id = Number(req.params.id)

    let appointment = await getBuscarConsulta(id)

    res.status(appointment.status_code)
    res.json(appointment)
})

route.delete('/consulta/:id', async (req, res) => {
    let id = Number(req.params.id)  

    let deleteAppointment = await setDeletarConsulta(id)

    res.status(deleteAppointment.status_code)
    res.json(deleteAppointment)
})