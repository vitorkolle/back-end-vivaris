
//npx ts-node app.ts

import { TUser } from './src/domain/entities/user-entity'
import { TUserPreferences } from './src/domain/entities/user-preferences'

//Import pacotes express
import express from 'express'
import { Router } from 'express'
//Criação das configurações das rotas para endpoint
const route = Router()


//Import pacotes cors 
import cors from 'cors'

//Import Controller 
import { setInserirUsuario } from './src/controller/usuario/controller_usuario'
import { setInserirPreferencias } from './src/controller/preferencia/controller_preferencia'

//Criação do app
const app = express()

app.use(express.json())
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())

    next()
})

/*********************************************************************************** */

//Post de Usuario
route.post('/cliente', async (req, res) => {

    const contentType = req.header('content-type')

    const userData: TUser = {
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        telefone: req.body.telefone,
        cpf: req.body.cpf,
        data_nascimento: req.body.data_nascimento,
        id_sexo: req.body.sexo
    }
    console.log(userData);

    let newUser = await setInserirUsuario(userData, contentType)

    res.status(newUser.status_code)
    res.json(newUser)

})

route.post('/cliente/preferencias', async (req, res) => {
    const contentType = req.header('content-type')

    const userData : TUserPreferences = {
        id_cliente: req.body.id_cliente,
        preferencias: req.body.preferencias
    }

    let newUserPrefence = await setInserirPreferencias(userData, contentType)

    res.status(newUserPrefence.status_code)
    res.json(newUserPrefence)
 
})

//Ativação das rotas
app.use('/v1/vivaris', route)

route.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});

//Ativação na porta 8080
app.listen('8080', () => {
    console.log("API funcionando na porta 8080");
})
