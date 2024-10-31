/*************** Mensagens de Erro ***************/
declare const ERROR_INVALID_ID: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_REQUIRED_FIELDS: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_NOT_FOUND: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_NOT_FOUND_PROFESSIONAL: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_NOT_FOUND_PREFERENCE: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_NOT_FOUND_AVAILBILITY: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_ALREADY_EXISTS_PREFRENCE: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_INTERNAL_SERVER_DB: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_INTERNAL_SERVER: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_CONTENT_TYPE: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_NOT_CREATED: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_ALREADY_EXISTS_ACCOUNT_EMAIL: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_ALREADY_EXISTS_ACCOUNT_CPF: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_ALREADY_EXISTS_ACCOUNT_CIP: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_DATE_NOT_VALID: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_AGE_NOT_VALID: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_ALREADY_EXISTS_PROFESSIONAL_AVAILBILITY: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const ERROR_NOT_DELETED: {
    status: boolean;
    status_code: number;
    message: string;
};
export declare const ERROR_INVALID_CARD: {
    status: boolean;
    status_code: number;
    message: string;
};
/****************** Mensagens de Sucesso *********/
declare const SUCCESS_CREATED_ITEM: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const SUCCESS_DELETED_ITEM: {
    status: boolean;
    status_code: number;
    message: string;
};
declare const SUCCESS_UPDATED_ITEM: {
    status: boolean;
    status_code: number;
    message: string;
};
export { ERROR_INVALID_ID, ERROR_REQUIRED_FIELDS, ERROR_NOT_FOUND, ERROR_INTERNAL_SERVER_DB, ERROR_CONTENT_TYPE, ERROR_INTERNAL_SERVER, SUCCESS_CREATED_ITEM, SUCCESS_DELETED_ITEM, SUCCESS_UPDATED_ITEM, ERROR_NOT_CREATED, ERROR_NOT_FOUND_PREFERENCE, ERROR_ALREADY_EXISTS_PREFRENCE, ERROR_ALREADY_EXISTS_ACCOUNT_CPF, ERROR_ALREADY_EXISTS_ACCOUNT_EMAIL, ERROR_DATE_NOT_VALID, ERROR_ALREADY_EXISTS_ACCOUNT_CIP, ERROR_AGE_NOT_VALID, ERROR_NOT_FOUND_PROFESSIONAL, ERROR_NOT_FOUND_AVAILBILITY, ERROR_ALREADY_EXISTS_PROFESSIONAL_AVAILBILITY, ERROR_NOT_DELETED };
