"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_NOT_CREATED = exports.SUCCESS_UPDATED_ITEM = exports.SUCCESS_DELETED_ITEM = exports.SUCCESS_CREATED_ITEM = exports.ERROR_INTERNAL_SERVER = exports.ERROR_CONTENT_TYPE = exports.ERROR_INTERNAL_SERVER_DB = exports.ERROR_NOT_FOUND = exports.ERROR_REQUIRED_FIELDS = exports.ERROR_INVALID_ID = void 0;
/*************** Mensagens de Erro ***************/
const ERROR_INVALID_ID = { status: false, status_code: 400, message: 'O ID encaminhado na requisição não é válido!!' };
exports.ERROR_INVALID_ID = ERROR_INVALID_ID;
const ERROR_REQUIRED_FIELDS = { status: false, status_code: 400, message: 'Existem campos requeridos que não foram preenchidos, ou não atendem aos critérios de digitação!!' };
exports.ERROR_REQUIRED_FIELDS = ERROR_REQUIRED_FIELDS;
const ERROR_NOT_FOUND = { status: false, status_code: 404, message: 'Não foram encontrados itens na requisição!!' };
exports.ERROR_NOT_FOUND = ERROR_NOT_FOUND;
const ERROR_INTERNAL_SERVER_DB = { status: false, status_code: 500, message: 'Não foi possível processar a requisição devido à um problema na comunicação com o Banco de Dados. Contate o Administrador da API!!' };
exports.ERROR_INTERNAL_SERVER_DB = ERROR_INTERNAL_SERVER_DB;
const ERROR_CONTENT_TYPE = { status: false, status_code: 415, message: 'O content-type encaminhado na requisição não é permitido pelo servidor da API. Deve-se utilizar somente application/json!!!' };
exports.ERROR_CONTENT_TYPE = ERROR_CONTENT_TYPE;
const ERROR_INTERNAL_SERVER = { status: false, status_code: 500, message: 'Não foi possível processar a requisição devido à um problema na camada de negócio/controle do projeto. Contate o administrador da API!!' };
exports.ERROR_INTERNAL_SERVER = ERROR_INTERNAL_SERVER;
const ERROR_NOT_CREATED = { status: false, status_code: 500, message: 'Não foi possível processar a requisição devido à algum problema com os dados recebidos!!' };
exports.ERROR_NOT_CREATED = ERROR_NOT_CREATED;
/****************** Mensagens de Sucesso *********/
const SUCCESS_CREATED_ITEM = { status: true, status_code: 201, message: 'Item criado com sucesso!!' };
exports.SUCCESS_CREATED_ITEM = SUCCESS_CREATED_ITEM;
const SUCCESS_DELETED_ITEM = { status: true, status_code: 200, message: 'Item deletado com sucesso!!' };
exports.SUCCESS_DELETED_ITEM = SUCCESS_DELETED_ITEM;
const SUCCESS_UPDATED_ITEM = { status: true, status_code: 200, message: 'Item atualizado com sucesso!!' };
exports.SUCCESS_UPDATED_ITEM = SUCCESS_UPDATED_ITEM;
