/*************** Mensagens de Erro ***************/
export const ERROR_INVALID_ID = {status: false, status_code: 400, message: 'O ID encaminhado na requisição não é válido!!'}
export const ERROR_REQUIRED_FIELDS = {status: false, status_code: 400, message: 'Existem campos requeridos que não foram preenchidos, ou não atendem aos critérios de digitação!!'}
export const ERROR_NOT_FOUND = {status: false, status_code: 404, message: 'Não foram encontrados itens na requisição!!'}
export const ERROR_NOT_FOUND_ASSESSMENT = {status: false, status_code: 404, message: 'Não foram encontradas consultas na requisição!!'}
export const ERROR_NOT_FOUND_PROFESSIONAL = {status: false, status_code: 404, message: 'Não foram encontrados psicólogos na requisição!!'}
export const ERROR_NOT_FOUND_CLIENT = {status: false, status_code: 404, message: 'Não foram encontrados clientes na requisição!!'}
export const ERROR_NOT_FOUND_PREFERENCE = {status: false, status_code: 404, message: 'Não foram encontradas preferências na requisição!!'}
export const ERROR_NOT_FOUND_AVAILBILITY = {status: false, status_code: 404, message: 'Não foram encontradas disponibilidades na requisição!!'}
export const ERROR_ALREADY_EXISTS_PREFRENCE = {status: false, status_code: 404, message: 'As preferências da requisição já estão escolhidas!!'}
export const ERROR_ALREADY_EXISTS_EMOTION = {status: false, status_code: 400, message: 'A emoção já existe!!'}
export const ERROR_NOT_FOUND_EMOTION = {status: false, status_code: 404, message: 'Não foram encontradas emoções na requisição!!'}
export const ERROR_INTERNAL_SERVER_DB = {status: false, status_code: 500, message: 'Não foi possível processar a requisição devido à um problema na comunicação com o Banco de Dados. Contate o Administrador da API!!'}
export const ERROR_CONTENT_TYPE = {status: false, status_code: 415, message: 'O content-type encaminhado na requisição não é permitido pelo servidor da API. Deve-se utilizar somente application/json!!!' }
export const ERROR_INTERNAL_SERVER = {status: false, status_code:500, message: 'Não foi possível processar a requisição devido à um problema na camada de negócio/controle do projeto. Contate o administrador da API!!'}
export const ERROR_NOT_CREATED = {status: false, status_code:500, message:'Não foi possível processar a requisição devido à algum problema com os dados recebidos!!'}
export const ERROR_NOT_UPDATED = {status: false, status_code:500, message:'Não foi possível processar a requisição devido à algum problema com os dados recebidos!!'}
export const ERROR_ALREADY_EXISTS_ACCOUNT_EMAIL = {status: false, status_code:400, message:'Já existe uma conta cadastrada com esse email, faça login ou use outro email'}
export const ERROR_ALREADY_EXISTS_ACCOUNT_CPF = {status: false, status_code:400, message:'Já existe uma conta cadastrada com esse cpf, faça login ou use outro cpf'}
export const ERROR_ALREADY_EXISTS_ACCOUNT_CIP = {status: false, status_code:400, message:'Já existe uma conta cadastrada com esse cip, faça login ou use outro cip'}
export const ERROR_DATE_NOT_VALID = {status: false, status_code:400, message:'A data informada não é válida!!'}
export const ERROR_AGE_NOT_VALID = {status: false, status_code:400, message:'Essa ação não é permitida para menores de idade!!'}
export const ERROR_ALREADY_EXISTS_PROFESSIONAL_AVAILBILITY = {status: false, status_code:400, message:'Essa disponibilidade já está ocupada'}
export const ERROR_NOT_DELETED = {status: false, status_code:400, message:'Não foi possível deletar a disponibilidade'}
export const ERROR_INVALID_CARD = {status: false, status_code:400, message:'Os dados do cartão não são válidos, revise-os e tente novamente'}
export const ERROR_INVALID_PAYMENT_METHOD_ID = {status: false, status_code:400, message:'Este ID de forma de pagamento não existe!'}
export const ERROR_INVALID_AUTH_TOKEN = {status: false, status_code:401, message:'O token de autenticação enviado na requisição é inválido!!'}
export const ERROR_NOT_FOUND_APPOINTMENTS = {status: false, status_code:404, message: 'Não foram encontradas consultas na requisiçã!'}
export const ERROR_CONFLICT_APPOINTMENT = {status: false, status_code:409, message:'Agendamento indisponível! Já existe uma consulta marcada para o mesmo horário.'}

/****************** Mensagens de Sucesso *********/
export const SUCCESS_CREATED_ITEM = {status: true, status_code: 201, message: 'Item criado com sucesso!!'}
export const SUCCESS_DELETED_ITEM = {status: true, status_code: 200, message: 'Item deletado com sucesso!!'}
export const SUCCESS_UPDATED_ITEM = {status: true, status_code: 200, message: 'Item atualizado com sucesso!!'}

