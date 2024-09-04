//Import pacotes express
import express from 'express'
import { request, response } from 'express'
import { Router, Request, Response } from 'express'

//Import pacotes cors
import cors from 'cors'

//Import pacotes body-parser
import bodyParser from 'body-parser'
const bodyParserJSON = bodyParser.json()


//Import Controller
import { setInserirUsuario } from './controller/controller_usuario'

//Import Entities
import { TUser } from './domain/entities/user-entity'

//Criação do app
const app = express()

//Criação das configurações das rotas para endpoint
const route = Router()

//Ativação das rotas
app.use(route)


/*********************************************************************************** */

//Post de Usuario
route.post('/v1/vivaris/cliente', bodyParserJSON, cors(), async (request: Request, response: Response) =>{
    
    const contentType = request.header('content-type')

    const userData = {
        nome: request.body.nome,
        email: request.body.email,
        senha: request.body.senha,
        telefone: request.body.telefone,
        cpf: request.body.cpf,
        data_nascimento: request.body.data_nascimento,
        sexo: request.body.sexo
    }
    
    let newUser = await setInserirUsuario(userData, contentType)

    response.status(newUser.status_code)
    response.json(newUser)

})



//Ativação na porta 8080
app.listen('8080', function(){
    console.log("API funcionando na porta 8080");
})
