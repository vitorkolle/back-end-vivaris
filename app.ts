
//npx ts-node app.ts

import { TUser } from './src/domain/entities/user-entity'
import { TUserPreferences } from './src/domain/entities/user-preferences'

//Import pacotes express
import express, { query } from 'express'
import { Router } from 'express'

//Criação das configurações das rotas para endpoint
const route = Router()


//Import pacotes cors 
import cors from 'cors'

//Import Controller 
import { getBuscarSexo, getListarSexo, getLogarCliente, setInserirUsuario } from './src/controller/usuario/controller_usuario'
import { setInserirPreferencias } from './src/controller/preferencia/controller_preferencia'
import { getAllSexos } from './src/model/DAO/cliente/sexo'
import { TProfessional } from './src/domain/entities/professional-entity'
import { setInserirPsicologo } from './src/controller/usuario/controller_psicologo'

//Criação do app
const app = express()

app.use(express.json())
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())

    next()
})

/****************************************************USUARIO****************************************************/
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

//post de psicólogos
route.post('/psicologo', async (req, res) => {
    const contentType = req.header('content-type')

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

    console.log(professionalData);

    const newProfesional = await setInserirPsicologo(professionalData, contentType)

    res.status(newProfesional.status_code)
    res.json(newProfesional)
})

//login de usuário
route.post('/login/usuario', async (req, res) => {
    let email = req.body.email
    let senha = req.body.senha

    let user = await getLogarCliente(String(email), String(senha))

    console.log(user);
    

    res.status(user.status_code)
    res.json(user)

})



/****************************************************GÊNERO****************************************************/
route.get('/cliente/sexo', async (req, res) => {
    let allSex = await getListarSexo()


    res.status(allSex.status_code)
    res.json(allSex)

})

route.get('/cliente/sexo/:id', async (req, res) => {
    let id = req.params.id
    let idFormat = Number(id)

    let buscarSexo = await getBuscarSexo(idFormat)

    res.status(buscarSexo.status_code)
    res.json(buscarSexo)
})






//Ativação das rotas
app.use('/v1/vivaris', route)

//Ativação na porta 8080
app.listen('8080', () => {
    console.log("API funcionando na porta 8080");
})
