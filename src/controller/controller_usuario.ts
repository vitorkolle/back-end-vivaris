import { ERROR_CONTENT_TYPE, ERROR_INTERNAL_SERVER } from "../../module/config"


const message = require('../config')

const setInserirUsuario = async function(dadosUsuario: JSON, contentType: String){
    try {
        if(contentType != 'application/json'){
            return ERROR_CONTENT_TYPE
        }else{
            
        }
    } catch (error) {
        return ERROR_INTERNAL_SERVER
    }
}