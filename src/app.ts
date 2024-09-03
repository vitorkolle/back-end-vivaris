//Import pacotes express
import express from 'express'
import { request, response } from 'express'
import { Router, Request, Response } from 'express'

//Import pacotes cors
import cors from 'cors'

//Import pacotes body-parser
import bodyParser from 'body-parser'

//Criação do app
const app = express()

//Criação das configurações das rotas para endpoint
const route = Router()

//Criação de endpoint
route.get('/', cors(), (request: Request, response: Response) =>{
    response.json({ message: 'Wow! My first project in TypeScript!!!' })
})

//Ativação das rotas
app.use(route)

//Ativação na porta 8080
app.listen('8080', function(){
    console.log("API funcionando na porta 8080");
})
