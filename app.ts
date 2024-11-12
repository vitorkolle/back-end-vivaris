import { TUser } from './src/domain/entities/user-entity'
import { TUserPreferences } from './src/domain/entities/user-preferences'

import express, { Router } from 'express'

const route: Router = express.Router()

const app = express()

import cors from 'cors'

const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use('/v1/vivaris', route)

app.listen('8080', () => {
    console.log("API funcionando na porta 8080");
})


//Import Controller 
import { criarDisponibilidadePsicologo, getBuscarDisponibilidade, getListarDisponibilidadesProfissional, setAtualizarDisponibilidade, setAtualizarDisponibilidadeProfissional, setDeletarDisponibilidade, setInserirDisponibilidade } from './src/controller/disponibilidade/controller_disponibilidade'
import { getBuscarPreferencia, getListarPreferencias, setInserirPreferencias } from './src/controller/preferencia/controller_preferencia'
import { getBuscarPsicologo, getListarPsicologos, getLogarPsicologo, setInserirPsicologo } from './src/controller/usuario/controller_psicologo'
import { getBuscarCliente, getBuscarClientePreferencias, getBuscarSexo, getListarSexo, getLogarCliente, setInserirUsuario } from './src/controller/usuario/controller_usuario'
import { TAvailability } from './src/domain/entities/availability-entity'
import { TProfessionalAvailability } from './src/domain/entities/professional-availability'
import { TProfessional } from './src/domain/entities/professional-entity'

import { confirmPayment, createPaymentIntent } from './src/controller/pagamento/controller_pagamento'
import { TCard } from './src/domain/entities/card-entity'
import stripe from 'stripe'

route.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {

    const signature = req.headers['stripe-signature'];
    
    if (!signature || typeof signature !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing Stripe signature' });
    }

    const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_ENDPOINT_SECRET);

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;

            await confirmPayment(session)

            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
})

app.use(express.json())

/****************************************************USUARIO-CLIENTE****************************************************/
//post de clientes
route.post('/cliente', async (req, res) => {

    const contentType = req.header('content-type')

    const userData: TUser = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        telefone: req.body.telefone,
        cpf: req.body.cpf,
        data_nascimento: req.body.data_nascimento,
        id_sexo: req.body.id_sexo
    }
    console.log(userData);

    let newUser = await setInserirUsuario(userData, contentType)

    res.status(newUser.status_code)
    res.json(newUser)

})

//post de Preferências de Usuário
route.post('/cliente/preferencias', async (req, res) => {
    const contentType = req.header('content-type')

    const userData: TUserPreferences = {
        id_cliente: req.body.id_cliente,
        preferencias: req.body.preferencias
    }

    let newUserPrefence = await setInserirPreferencias(userData, contentType)

    res.status(newUserPrefence.status_code)
    res.json(newUserPrefence)

})

//login de usuário
route.post('/login/usuario', async (req, res) => {
    let email = req.body.email
    let senha = req.body.senha

    let user = await getLogarCliente(email, senha)

    console.log(user);


    res.status(user.status_code)
    res.json(user)

})


route.get('/usuario/:id', async (req, res) => {
    let id = Number(req.params.id)

    let userData = await getBuscarCliente(id)

    res.status(userData.status_code)
    res.json(userData)
})

route.get('/usuario/preferencias/:id', async (req, res) => {
    let id = Number(req.params.id)

    let userData = await getBuscarClientePreferencias(id)

    res.status(userData.status_code)
    res.json(userData)
})


/****************************************************GÊNERO****************************************************/
route.get('/sexo', async (req, res) => {
    let allSex = await getListarSexo()

    res.status(allSex.status_code)
    res.json(allSex)

})

route.get('/usuario/sexo/:id', async (req, res) => {
    let id = req.params.id
    let idFormat = Number(id)

    let buscarSexo = await getBuscarSexo(idFormat)

    res.status(buscarSexo.status_code)
    res.json(buscarSexo)
})


/****************************************************PSICÓLOGO****************************************************/

//post de psicólogos
route.post('/psicologo', async (req, res) => {
    const contentType = req.header('Content-Type')

    const professionalData: TProfessional = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        telefone: req.body.telefone,
        cpf: req.body.cpf,
        cip: req.body.cip,
        data_nascimento: req.body.data_nascimento,
        id_sexo: req.body.id_sexo
    }

    const newProfesional = await setInserirPsicologo(professionalData, contentType)

    console.log(newProfesional);

    res.status(newProfesional.status_code)
    res.json(newProfesional)
})

route.post('/profissional/login', async (req, res) => {
    let email = req.body.email
    let senha = req.body.senha

    let user = await getLogarPsicologo(email, senha)

    console.log(user);

    res.status(user.status_code)
    res.json(user)

})

route.get('/profissional/:id', async (req, res) => {
    const id = Number(req.params.id)

    const getUser = await getBuscarPsicologo(id)

    res.status(getUser.status_code)
    res.json(getUser)
})

route.get('/profissionais', async (req, res) => {
    const getProfissionais = await getListarPsicologos()

    res.status(getProfissionais.status_code)
    res.json(getProfissionais)
})

/****************************************************DISPONIBILIDADE****************************************************/
route.post('/disponibilidade', async (req, res) => {
    const contentType = req.header('content-type')

    const disponibilidade: TAvailability = {
        dia_semana: req.body.dia_semana,
        horario_inicio: req.body.horario_inicio,
        horario_fim: req.body.horario_fim
    }

    let rsDisponilidade = await setInserirDisponibilidade(disponibilidade, contentType)

    console.log(disponibilidade);

    res.status(rsDisponilidade.status_code)
    res.json(rsDisponilidade)
})

route.post('/disponibilidade/psicologo/:id', async (req, res) => {
    let id = Number(req.params.id)

    const availability: TProfessionalAvailability = {
        disponibilidade_id: req.body.disponibilidade,
        status: req.body.status,
        id_psicologo: id
    }

    let rsDisponilidade = await criarDisponibilidadePsicologo(availability)

    console.log(rsDisponilidade);

    res.status(rsDisponilidade.status_code!!)
    res.json(rsDisponilidade)
})

route.get('/disponibilidade/psicologo/:id', async (req, res) => {
    let id = Number(req.params.id)

    const professionalAvailbility = await getListarDisponibilidadesProfissional(id)

    res.status(professionalAvailbility.status_code)
    res.json(professionalAvailbility)
})


route.delete('/disponibilidade/psicologo/:id', async (req, res) => {
    let id = Number(req.params.id)
    let diaSemana = String(req.body.dia_semana)

    const availabilityData = await setDeletarDisponibilidade(diaSemana, id)

    console.log(availabilityData);


    res.status(availabilityData.status_code)
    res.json(availabilityData)
})

route.get('/disponibilidade/:id', async (req, res) => {
    let id = Number(req.params.id)

    const buscarDisponibilidade = await getBuscarDisponibilidade(id)

    res.status(buscarDisponibilidade.status_code)
    res.json(buscarDisponibilidade)
})

route.put('/disponibilidade/:id', async (req, res) => {
    const id = Number(req.params.id)

    const availabilityData: TAvailability = {
        dia_semana: req.body.dia_semana,
        horario_inicio: req.body.horario_inicio,
        horario_fim: req.body.horario_fim
    }

    const contentType = req.header('content-type')

    let updateAvaibility = await setAtualizarDisponibilidade(availabilityData, contentType, id)

    console.log(availabilityData, id);


    res.status(updateAvaibility.status_code)
    res.json(updateAvaibility)
})

route.put('/psicologo/disponibilidade', async (req, res) => {

    const availabilityData: TProfessionalAvailability = {
        id_psicologo: req.body.id_psicologo,
        disponibilidade_id: req.body.disponibilidade_id,
        status: req.body.status
    }

    let contentType = req.header('content-type')

    let updateProfessionalAvailbility = await setAtualizarDisponibilidadeProfissional(availabilityData, contentType)

    res.status(updateProfessionalAvailbility.status_code)
    res.json(updateProfessionalAvailbility)
})

/****************************************************PREFERÊNCIAS****************************************************/
route.get('/preferencias', async (req, res) => {
    let preferenceData = await getListarPreferencias()

    console.log(preferenceData)

    res.status(preferenceData.status_code)
    res.json(preferenceData)

})

route.get('/preferencias/:id', async (req, res) => {
    console.log("g");

    let id = Number(req.params.id)

    let preferenceData = await getBuscarPreferencia(id)

    res.status(preferenceData.status_code)
    res.json(preferenceData)
})

/****************************************************PAGAMENTO****************************************************/
route.post('/create-checkout-session', async (req, res) => {

    let idConsulta = Number(req.body.id_consulta)

    let idCliente = Number(req.body.id_cliente)

    const result = await createPaymentIntent(idConsulta, idCliente)

    res.status(result.status_code)
    res.json(result)

})

